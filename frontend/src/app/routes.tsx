import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { Upload } from "./pages/upload";
import { Stories } from "./pages/stories";
import { StoryDetail } from "./pages/story-detail";
import { Chat } from "./pages/chat";
import { About } from "./pages/about";
import { NotFound } from "./pages/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "upload", Component: Upload },
      { path: "stories", Component: Stories },
      { path: "stories/:id", Component: StoryDetail },
      { path: "chat", Component: Chat },
      { path: "about", Component: About },
      { path: "*", Component: NotFound },
    ],
  },
]);
