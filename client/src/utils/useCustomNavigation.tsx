import { useNavigate, NavigateFunction } from "react-router-dom";

const useCustomNavigation = () => {
  const navigate: NavigateFunction = useNavigate();

  /**
   * Redirects to a given path based on a condition.
   * @param path - The path to redirect to.
   * @param condition - If true, it redirects. Default is true.
   * @param replace - If true, replaces the history entry instead of pushing. Default is false.
   */
  const redirect = (path: string, condition: boolean = true, replace: boolean = false) => {
    if (condition) {
      navigate(path, { replace });
    }
  };

  return redirect;
};

export default useCustomNavigation;
