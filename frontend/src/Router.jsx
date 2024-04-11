import { Route, Routes } from "react-router";
import PrivateRoutes from "./utils/PrivateRoutes";
import LoginPage from "./pages/LoginPage";
import SideNavLayout from "./layout/SideNavLayout";
import NotebookPage from "./pages/NotebookPage";
import RecentPage from "./pages/RecentPage";
import YourNotebooksPage from "./pages/YourNotebooksPage";
import SharedWithYouPage from "./pages/SharedWithYouPage";
import OverViewPage from "./pages/OverViewPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import AccountPage from "./pages/AccountPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/main" element={<SideNavLayout />}>
          <Route path="overview" element={<OverViewPage />} />
          <Route path="notebook/:notebookId" element={<NotebookPage />} />
          <Route path="recent" element={<RecentPage />} />
          <Route path="your-notebooks" element={<YourNotebooksPage />} />
          <Route path="shared-with-you" element={<SharedWithYouPage />} />
          <Route path="account" element={<AccountPage />}></Route>
          <Route path="*" element={<OverViewPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
