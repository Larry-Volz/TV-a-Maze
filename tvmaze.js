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


// ----------------------------------------- UPCOMING SHOW SECTION ----------------------------------------//



//DONE: set up a div #upComingShows col to hold upcoming shows

//TODO: create getWebShows(date) to retrieve upcoming WEB shows by date
//TODO: create getNetShows(date) to retrieve upcoming NETWORK shows by date
      //TODO: hard-code each date & do generic GET first to test them

//TODO: create showUpcomingShows() to populate div with chosen show array with optional offset input
      //include up and down font-awesome icons 
      //re-call showUpcomingShows() with offset to update div

//TODO: set up a calendar input to get date (default to today)
      //TODO: hard-code it first to test it
//TODO: set up a drop-down with genre's top right corner
//TODO: set up switch for web shows vs networkshows      

//TODO: make icons at top of show info for episodes, cast and dates coming up using font-awesome and tool tips

function constructDate() {
  //later use parameters to customize - this just defaults to today
  let dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1; //months from 1-12
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();

newDate = `${year}-${month}-${day}`;
  return newDate;
}

async function getWebShows(date){
  // const showArray = await axios.get(`https://api.tvmaze.com/schedule/web?date=${date}`);
   $.getJSON(`https://api.tvmaze.com/schedule/web`, response => {
      const showArray = response;
      console.log(showArray[0].id);
      return showArray[0].id;
   });
}

//ORIGINAL
// async function getWebShows(date){
//   // const showArray = await axios.get(`https://api.tvmaze.com/schedule/web?date=${date}`);
//   const showArray = await axios.get(`https://api.tvmaze.com/schedule/web`);

//   console.log(webShows);
// return showArray;

// }


//??? WHAT AM I DOING DIFFERENTLY HERE THAN AT 99?!
let today = constructDate();

let webShows = getWebShows(today);









// ----------------------------------------- SHOW SEARCH SECTION ----------------------------------------//

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  // $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);

  $("#search-query").val("");
});


const MISSING_IMAGE_URL = "https://tinyurl.com/missing-tv";

async function searchShows(query) {
  // DONE: Make an ajax request to the searchShows api.  Removed
  // hard coded data.
  //target variables: res.data.show.etc.
  let res = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);

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
      `
        <div class="col-xl-6 mt-2 Show" data-show-id="${show.id}" >
          <div class="card" data-show-id="${show.id}">
            <div class="card-body" >
              <h5 class="card-title">${show.name}</h5>
              <img class="card-img-top" src="${show.image}">
              <p class="card-text">${show.summary}</p>
              <button class = "btn btn-primary border rounded" data-toggle="modal"  data-target="#episodeModal" id ="btn-${show.id}" value = "${show.id}">Get Episode List</button>
            </div>
          </div>
        </div>
      
      `);

    $showsList.append($item);

    const btnIdStr = `#btn-${show.id}`;

    $(btnIdStr).on("click", async () =>{      
      const episodeArray = await getEpisodes($(btnIdStr).val());
      populateEpisodes(episodeArray);

    });
  }
}


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

function populateEpisodes(episodeList) {
 
  const $episodesArea = $("#episodes-area");
  $("#episodes-area").show();

  let epiOutput = "";
  let season = 0;
  for (epi of episodeList) { 
    if (epi.season > season) {
      epiOutput += `<br><b>Season ${epi.season}: </b><br>`;
      season++;
    }
    epiOutput += `${epi.name}<br>`
  };

  // 

  let $item = $(`<!-- Modal -->
  <div class="modal fade" id="episodeModal" tabindex="-1" role="dialog" aria-labelledby="episodeModalTitle" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="episodeModalTitle">Episode List</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          ${epiOutput}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>`);

     $episodesArea.append($item);
  

  $('#episodeModal').modal('show')

  $('#episodeModal').on('hidden.bs.modal', function (e) {
    $("#episodeModal").remove();
  })
}

