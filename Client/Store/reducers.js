var profileState = {}
var dataState = [];


/*          PROFILE ACTIONS
*/


var ProfileReducer = (state = profileState, data) => {

    //console.log(data.payload, "payload data")
    switch (data.type) {
        case 'INJECT_PROFILE':
            state = data.payload;
            return state;

        default:
            return state;

    }
};


/*          ARTICLE ACTIONS
*/



var ArticleReducer = (state = dataState, action) => {
    switch (action.type) {

        

        case 'OVERWRITE_ARTICLE':
        state = action.payload;
            return state;


        case 'DELETE_ALL_STORY':
        var state = state.filter( e => e.public !== true);
        return state;

        case 'DELETE_ALL_DRAFT':
        var state = state.filter( e => e.public !== false);
        return state;
    

        case 'UPDATE_ARTICLE':
        var payload = action.payload;
        state.forEach((x, i) =>{
          if(x._id == payload._id){
              return state[i] = payload;
          }
          })
    
       // console.log(state, "FROMMMM", payload)
        return state;

        case 'DELETE':

            var state = state.filter((e) => e._id !== action.payload._id);
            return state;

        case 'INSERT_ARTICLE':
            state.push(action.payload);

            return state;
            

        default:
            return state;

    }
};


module.exports = { ProfileReducer, ArticleReducer };
