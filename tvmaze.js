/*
 * An API-based app to get information on episodes and 
 * other details of your favorite TV shows in cooperation with TV-Maze. 
 * (under construction)
 */
/*
FUTURE TO-DOS/Improvements
- initially making it with a single show return function.  Later update it so that if more
than one show is returned with the same name the user can pick which version of it they want to 
interact with (ex: top gear and battlestar galactica)
- add try-catch(e) blocks in case of 404 errors, etc.
- write up some tests for this
*/

/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

 const MISSING_IMAGE_URL = "https://tinyurl.com/missing-tv";
async function searchShows(query) {
  // DONE: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let res = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
  console.log(res);

  let arrayOfShows = res.data.map((searchResult) => {
    let show = searchResult.show;
  
      return  {
          id: show.id,
          name: show.name,
          summary: show.summary,
          image: show.image ? show.image.medium : MISSING_IMAGE_URL
        };
    });
   return arrayOfShows;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img src="${show.image}">
             <p class="card-text">${show.summary}</p>
             
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       https://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
}
