import { useEffect } from "react";
import Notebook from "../components/Notebook";
import NotebookV2 from "../components/NotebookV2";
import NotebookV3 from "../components/NotebookV3";

const NotebookPage = () => {
  // useParams to fetch url parameters
  // const params = useParams();
  // when documentId is passed : pass it to the Notebook component
  // when no documentId is passed : create default notebook (POST create notebook request)

  useEffect(() => {
    document.title = "Notebook"; // Set the desired page title
    return () => {
      document.title = "CodeRoom"; // Reset the title when the component unmounts
    };
  }, []);

  return <NotebookV3 />;
};

export default NotebookPage;
