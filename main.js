// --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// Global Parameter Setting

const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 45, bottom: 40, left: 275};

const numExamples = 10;

let width = MAX_WIDTH/4*3;
let height = MAX_HEIGHT/4*3;


let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let filename = "data/video_games.csv";

let raw_data = []; // to store the data.

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

// I want to read the csv file at the very begining.

d3.csv(filename).then(function(inp_data){
  
  // Step 0: There is a problem that some games share the same name, however in different year and platform. Therefore I group all the games with the same name.

  let inp_data_name = d3.group(inp_data,d => d.Name); // inp_data_name is a map which stores all the information.
  
  // For convenience, we set raw_data as a deep copy of the inp_data_name

  for (let [key, value] of inp_data_name){

      // If the games share the same name, then we reset the name as "name + platform + year".

      if (value.length > 1){
          for (let i = 0; i < value.length; i++){
             let temp_value = Object.assign({}, value[i]);
              temp_value.Name = temp_value.Name + " (" + temp_value.Platform + " " + temp_value.Year + ")";
              raw_data.push(temp_value)
          }
      }
      else{
        let temp_value = Object.assign({}, value[0]);
          raw_data.push(temp_value)
      }
  }
    //
});
//
