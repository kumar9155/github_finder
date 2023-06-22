import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";
const GithubContext = createContext();

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user:{},
    loading: false,
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);

  // Get Search results

  const searchUsers = async (text) => {
    setLoading();

   const params = new URLSearchParams({
    q: text
   })

    const response = await fetch(`https://api.github.com/search/users?${params}`, {
      headers: {
        Authorization: `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`,
      },
    });
    const {items} = await response.json();
    dispatch({
      type: "GET_USERS",
      payload: items,
    });
  };

// Get single user


  const getUser = async (login) => {
    setLoading();

  

    const response = await fetch(`https://api.github.com/users/${login}`, {
      headers: {
        Authorization: `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`,
      },
    });

if(response.status === 404){
  window.location ='./notfound'
}else{
  const data = await response.json();
  
  dispatch({
    type: "GET_USER",
    payload: data,
  });
}

    
  };

  //clear users from state

  const clearUsers = () => dispatch({type:'CLEAR_USERS'})

  //  Set Loading...
  const setLoading = () => dispatch({ type: "SET_LOADING" });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        user:state.user,
        searchUsers,
        clearUsers,
        getUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
