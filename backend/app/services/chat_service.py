"""
Chat Service for Uhodari
Handles conversation memory, community detection, and LLM interactions
"""

import json
import re
import redis
import os
from typing import Optional, Dict, List, Any
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

# Load environment variables from .env file
load_dotenv()

# ===========================
# Redis Connection
# ===========================
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    db=0,
    decode_responses=True
)

# ===========================
# LLM Initialization
# ===========================
groq_api_key = os.getenv("GROQ_API_KEY")
groq_model = os.getenv("GROQ_MODEL_NAME", "gemma-7b-it")  # Configurable model with fallback

if not groq_api_key:
    print("⚠️  WARNING: GROQ_API_KEY not found in environment!")
    print("   Actions:")
    print("   1. Create .env file in backend/ directory")
    print("   2. Add: GROQ_API_KEY=gsk_your_key_here")
    print("   3. Get free key from: https://console.groq.com/keys")
    print("   4. Restart the server")
    llm = None
else:
    try:
        llm = ChatGroq(
            temperature=0.7,
            model_name=groq_model,
            api_key=groq_api_key
        )
        print(f"✅ LLM initialized successfully")
        print(f"   Model: {groq_model}")
        print(f"   API key found: {groq_api_key[:10]}...")
    except Exception as e:
        print(f"❌ Error initializing LLM: {e}")
        print(f"   Model: {groq_model}")
        print(f"   If model is decommissioned, set GROQ_MODEL_NAME in .env")
        print(f"   Available models: gemma-7b-it, mixtral-8x7b, etc.")
        llm = None


# ===========================
# Conversation Memory Management
# ===========================
def save_message(conversation_id: str, role: str, message: str) -> None:
    """Save a message to conversation history in Redis"""
    key = f"chat:{conversation_id}"
    
    redis_client.rpush(
        key,
        json.dumps({
            "role": role,
            "content": message
        })
    )
    
    # Keep only last 20 messages
    redis_client.ltrim(key, -20, -1)
    
    # Set expiration to 7 days
    redis_client.expire(key, 7 * 24 * 60 * 60)


def get_memory(conversation_id: str) -> List[Dict[str, str]]:
    """Retrieve conversation history from Redis"""
    key = f"chat:{conversation_id}"
    msgs = redis_client.lrange(key, 0, -1)
    
    history = []
    for m in msgs:
        try:
            history.append(json.loads(m))
        except:
            continue
    
    return history


def clear_memory(conversation_id: str) -> None:
    """Clear conversation history"""
    key = f"chat:{conversation_id}"
    redis_client.delete(key)


# ===========================
# Community/Context Management
# ===========================
def set_active_community(conversation_id: str, community: str) -> None:
    """Store the detected community for a conversation"""
    redis_client.set(f"community:{conversation_id}", community)
    redis_client.expire(f"community:{conversation_id}", 7 * 24 * 60 * 60)


def get_active_community(conversation_id: str) -> Optional[str]:
    """Retrieve the active community for a conversation"""
    return redis_client.get(f"community:{conversation_id}")


# ===========================
# Community Detection
# ===========================
KENYAN_COMMUNITIES = [
    "kikuyu",
    "maasai",
    "luo",
    "kalenjin",
    "luhya",
    "kisii",
    "kamba",
    "meru",
    "embu",
    "turkana",
    "somali",
    "samburu",
    "masai",  # Alternative spelling
    "bantu",
    "nilotic",
    "cushitic",
    "swahili",
    "tharaka",
    "taita",
]

def detect_community(message: str) -> Optional[str]:
    """
    Detect if the message mentions a specific Kenyan community
    """
    msg = message.lower()
    
    for community in KENYAN_COMMUNITIES:
        if community in msg:
            return community
    
    return None


# ===========================
# Vector DB Context Retrieval (Placeholder)
# ===========================
def get_vector_context(
    query: str, 
    community: Optional[str] = None, 
    k: int = 5
) -> List[str]:
    """
    Retrieve relevant story contexts from vector DB
    
    TODO: Integrate with actual vector DB (chromadb, weaviate, etc.)
    For now, returns empty list - to be implemented with vector search
    """
    # This would typically query a vector DB with the embedding of the query
    # and return the top k most relevant story summaries/transcriptions
    
    # Placeholder implementation
    context_list = []
    
    # Example structure of what would be returned:
    # context_list = [
    #     "Story Title: Description... Transcription excerpt...",
    #     "Story Title: Description... Transcription excerpt...",
    # ]
    
    return context_list


# ===========================
# System Prompt
# ===========================
def build_system_prompt(
    page: str,
    selected_text: str,
    community: Optional[str],
    context: str
) -> str:
    """Build the system prompt for the LLM"""
    
    prompt = f"""You are Uhodari, an expert digital historian focused on preserving Kenyan cultural heritage, stories, traditions, and languages.

🎯 Your Primary Focus: KENYAN CULTURES & COMMUNITIES

Your Role:
- Preserve and share stories from Kenya's diverse communities (Kikuyu, Maasai, Luo, Kalenjin, Luhya, Kisii, Kamba, Meru, Embu, Turkana, Somali, Samburu, Swahili, Tharaka, Taita, and more)
- Explain Kenyan traditions, languages, and cultural practices with depth and respect
- Guide users to explore Kenya's rich cultural heritage
- Answer questions about specific Kenyan communities and their traditions
- Highlight the importance of preserving oral traditions and endangered Kenyan languages

📍 Geographic Priority:
1. PRIMARY: Kenyan cultures and communities (always start here)
2. SECONDARY: East African context (when relevant to Kenyan stories)
3. TERTIARY: Other African or global cultures (only if user specifically asks, and then relate back to Kenya)

Current Context:
- User's page: {page}
- Selected text: {selected_text or "None"}
- Community focus: {community or "General (all Kenyan communities)"}

Knowledge Base:
{context if context else "Drawing from Uhodari's archive of Kenyan cultural stories and traditions."}

📋 Response Guidelines:
1. **SUMMARIZE**: Keep responses concise but informative (2-4 paragraphs max unless they ask for more)
2. **PRIORITIZE KENYA**: Always feature Kenyan cultural information first
3. **BE SPECIFIC**: Mention actual community names, traditions, and stories
4. **BE CULTURAL**: Show respect for traditions and the communities that keep them alive
5. **CITE SOURCES**: Reference specific stories or cultural practices when possible
6. **ENGAGE**: Ask follow-up questions to encourage deeper exploration
7. **RELATE GLOBALLY**: If you must mention non-Kenyan cultures, relate them back to Kenyan practices

Example Response Pattern:
"In Kenyan culture, [specific practice from Kenyan community]... This is similar to [other practice] but distinctly [Kenyan difference]..."

Language Tone:
- Warm and inviting
- Respectful of cultural significance
- Encouraging participation in cultural preservation
- Educational but accessible
- Plain text only (no JSON, no formatting markup)

Remember: You are a guardian of Kenyan cultural heritage. Every answer should celebrate and preserve Kenya's diverse traditions."""
    
    return prompt


# ===========================
# Main Chat Logic
# ===========================
async def process_chat_message(
    message: str,
    conversation_id: str,
    page: str = "unknown",
    selected_text: str = ""
) -> Dict[str, Any]:
    """
    Main chat processing function
    
    Args:
        message: User's message
        conversation_id: Unique conversation identifier
        page: Current page the user is on
        selected_text: Any selected text on the page
    
    Returns:
        Dict with response and metadata
    """
    
    if not message.strip():
        return {
            "error": "Message is required",
            "type": "error"
        }
    
    try:
        # ===========================
        # 1. Detect Community
        # ===========================
        detected_community = detect_community(message)
        
        if detected_community:
            print(f"✓ Community detected: {detected_community}")
            set_active_community(conversation_id, detected_community)
        else:
            # Use previously detected community if available
            detected_community = get_active_community(conversation_id)
            if detected_community:
                print(f"✓ Using stored community: {detected_community}")
        
        # ===========================
        # 2. Retrieve Vector Context
        # ===========================
        context_list = get_vector_context(
            query=message,
            community=detected_community,
            k=5
        )
        
        context_block = "\n\n".join(context_list) if context_list else ""
        
        print(f"✓ Context retrieved: {len(context_block)} characters")
        
        # ===========================
        # 3. Get Conversation Memory
        # ===========================
        memory = get_memory(conversation_id)
        
        history_block = "\n".join([
            f"{m['role'].upper()}: {m['content']}"
            for m in memory[-5:]  # Last 5 messages for context
        ])
        
        print(f"✓ Memory loaded: {len(memory)} messages in history")
        
        # ===========================
        # 4. Build System Prompt
        # ===========================
        system_prompt = build_system_prompt(
            page=page,
            selected_text=selected_text,
            community=detected_community,
            context=context_block
        )
        
        # ===========================
        # 5. Call LLM
        # ===========================
        if not llm:
            raise Exception("LLM not initialized. Check GROQ_API_KEY")
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=message)
        ]
        
        # Add conversation history
        if memory:
            for msg in memory[-5:]:  # Include last 5 messages
                if msg['role'] == 'human':
                    messages.insert(-1, HumanMessage(content=msg['content']))
                else:
                    messages.insert(-1, SystemMessage(content=msg['content']))
        
        ai_response = llm.invoke(messages)
        response_content = ai_response.content
        
        print(f"✓ LLM Response: {response_content[:100]}...")
        
        # ===========================
        # 6. Save to Memory
        # ===========================
        save_message(conversation_id, "human", message)
        save_message(conversation_id, "ai", response_content)
        
        # ===========================
        # 7. Return Response
        # ===========================
        return {
            "type": "message",
            "content": response_content,
            "community": detected_community,
            "conversation_id": conversation_id,
            "has_context": len(context_list) > 0
        }
    
    except Exception as e:
        print(f"✗ Error in chat processing: {str(e)}")
        
        # Save error to memory
        save_message(conversation_id, "human", message)
        save_message(conversation_id, "ai", f"[Error: {str(e)}]")
        
        return {
            "type": "error",
            "error": str(e),
            "content": "I encountered an error processing your request. Please try again.",
            "conversation_id": conversation_id
        }


# ===========================
# Utility Functions
# ===========================
def get_conversation_summary(conversation_id: str) -> Dict[str, Any]:
    """Get metadata about a conversation"""
    memory = get_memory(conversation_id)
    community = get_active_community(conversation_id)
    
    return {
        "conversation_id": conversation_id,
        "message_count": len(memory),
        "active_community": community,
        "recent_messages": memory[-3:] if memory else []
    }
