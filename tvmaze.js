/*
 * An API-based app to get information on episodes and 
 * other details of your favorite TV shows in cooperation with TV-Maze. 
 * (under construction)
 */
/*
FUTURE TO-DOS/Improvements
- add try-catch(e) blocks in case of 404 errors, etc.
- write up some tests 
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
  // DONE: Make an ajax request to the searchShows api.  Removed
  // hard coded data.
  //target variables: res.data.show.etc.
  let res = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
  // console.log(res);

  let arrayOfShows = res.data.map((tv) => {
    let show = tv.show;
  
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
    let $item = $(  //NOTICE USE OF data- for show-id I we can ref it later!!!
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src="${show.image}">
             <p class="card-text">${show.summary}</p>
             <button class = "btn btn-primary border rounded" data-toggle="modal"  data-target="#exampleModalLong" id ="btn-${show.id}" value = "${show.id}">Get Episode List</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);

    const btnIdStr = `#btn-${show.id}`;

    $(btnIdStr).on("click", () =>{      
      const episodeArray = getEpisodes($(btnIdStr).val());
      populateEpisodes(episodeArray);

    });
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
  // DONE: get episodes from tvmaze
  console.log(`Button id: ${id} clicked`);

  res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)

  // DONE: returns array-of-episode-info

  let arrayOfEpisodes = res.data.map((tv) => {
    // let show = tv.show;
  
      return  {
          id: tv.id,
          name: tv.name,
          season: tv.season,
          number: tv.number
        };
    });
    console.log(arrayOfEpisodes);
   return arrayOfEpisodes;
}



//------------------------------- NEW STUFF -----------------------------------------
/**
 * accepts an array of episodes and populates a div with them
 * @param {} shows 
 */

function populateEpisodes(shows) {
  const $episodesList = $("#episodes-list");
  // $episodesList.empty();
  console.log('IN POPULATE EPISODES METHOD')
  $episodesList.css("display","");
  $episodesList.css("display","block");
  $("#episodes-area").show();

 

  $episodesList.text("I AM HERE!!!");

  let $item = $(`<!-- Modal -->
  <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Episode List</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          ... STUFF AND THINGS HERE!
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>`);

     $episodesList.append($item);
  

  $('#exampleModalLong').modal('show')
}



  // for (let episode of episodeList) {
  //   let $item = $(  //NOTICE USE OF data- for show-id I we can ref it later!!!
  //     `<div class="col-md-6 col-lg-3 Show" data-show-id="${dpisode.id}">
  //        <div class="card" data-show-id="${episode.id}">
  //          <div class="card-body">
  //            <h5 class="card-title">${episode.name}</h5>
  //            <img class="card-img-top" src="${show.image}">
  //            <p class="card-text">${show.summary}</p>
             
  //          </div>
  //        </div>
  //      </div>
  //     `);
  // }