var  r = 27 , c = 30;

// building the input board (table) and coloring the clicked cells
function start() {
    var table = document.getElementById('tbl');
    for (let i = 0; i < r; i++) {
        var tr = document.createElement('tr');
        tr.setAttribute('class','tr')
        for (let j = 0; j < c; j++) {
            var td = document.createElement('td');
            td.setAttribute("id","td "+i+','+j);
            td.setAttribute("class","tdcellDead");
            td.addEventListener('click',function change(params) {
            var ClickedtdCell = document.getElementById("td "+i+','+j);
            ClickedtdCell.setAttribute("class","tdcellalive");
            })
            tr.appendChild(td);
        }    
        table.appendChild(tr); 
    }
    
}

start();

// play , stop , reset buttons

var timeout ;

function play(){
    timeout = setInterval(function play() {
    update(); }, 1000);
}

function stop() {
    clearInterval(timeout);
}

function reset() {
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            var td = document.getElementById("td "+i+','+j);
            td.setAttribute('class','tdcellDead');
        }    
    }
    clearInterval(timeout);
}




// get the clicked cells ids (x,y position) and return them as an array

function getClickedCells() {
    var ids = []; 
    var k = 0;
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            var td = document.getElementById("td "+i+','+j);
            if (td.className == 'tdcellalive') {
                var id = i+','+j ;
                ids[k] = id ;
                k++;
            }
        }    
    }
    return ids;
}
 

// get the cells surrounding the clicked cells ( the 8 neighbors to each clicked cell)

function surroundings(params) {
    var neighbors = [];
    for (let k = 0; k < params.length; k++) {
        p = params[k].split(",").map((e) => parseInt(e));
        var i = p[0] , j = p[1];
        neighbors.push({
            n1:        ( (i-1) +',' + j),
            n2:        ((i-1)+','+(j+1)),
            n3:        (i +','+ (j+1)),
            n4:        ((i+1)+','+ (j+1)),
            n5:        ((i+1)+','+ j),
            n6:        ((i+1)+','+ (j-1)),
            n7:        (i+','+(j-1)),
            n8:        ((i-1)+','+ (j-1))
          });
        }
        return neighbors;
}


 

 /**
  * test each neighbor cell ( counting the lived cells surrounding each neighbor ) the same thing goes for clicked cells
  *
  * @returns {array} counter_Arr         contain arrays each represents the count of the alive cells for each neighbor
  * @returns {array} keys                contain x,y position of each neighbor (tested cell)
  * @returns {array} cell_alive_count    contain the count of live cells surrounding each clicked cell
 */

function test() {
    var cells = surroundings(getClickedCells());
    var keys = [];
    var counter_Arr =[];
    var neighbor ;
    for (var z=0 ; z < cells.length; z++) {
        neighbor = cells[z];
        var neighbor_count = [];
        for (var key in neighbor) {
            if (neighbor.hasOwnProperty(key)) {
                p = neighbor[key].split(",").map((e) => parseInt(e));
                var i = p[0] , j = p[1];
                var count = 0;
                if(document.getElementById('td '+(i-1)+','+j).className == 'tdcellalive'){
                    count++; 
                }
                if(document.getElementById('td '+(i-1)+','+(j+1)).className == 'tdcellalive'){
                    count++;
                }
                if(document.getElementById('td '+i+','+ (j+1)) .className== 'tdcellalive' ){
                    count++;
                }
                if(document.getElementById('td '+(i+1)+','+(j+1)).className == 'tdcellalive'){
                    count++;
                }
                if(document.getElementById('td '+(i+1)+','+j).className == 'tdcellalive'){
                    count++;
                }
                if(document.getElementById('td '+(i+1)+','+(j-1)).className == 'tdcellalive'){
                    count++;
                }
                if(document.getElementById('td '+i+','+ (j-1)).className == 'tdcellalive'){
                    count++;
                }
                if(document.getElementById('td '+(i-1)+','+(j-1)).className == 'tdcellalive'){
                    count++;
                }
    
                neighbor_count.push(count);
                keys.push({i,j});
               
            }             
        }
        counter_Arr.push(neighbor_count);
    }

    // test the clicked cells ( counting the number of lived cells around each clicked cell )
    
    var cell_alive_count = [];
    for (var m=0 ; m < cells.length; m++) {
        var clicked_cell_surronding = cells[m];
         var count = 0;
         for (var key in clicked_cell_surronding) {
            
             if (clicked_cell_surronding.hasOwnProperty(key)) {
                 p = clicked_cell_surronding[key].split(",").map((e) => parseInt(e));
                 var i = p[0] , j = p[1];
                 if(document.getElementById('td '+i+','+j).className == 'tdcellalive'){
                     count++; 
                }
                 
            }
        }
        cell_alive_count.push(count);
    }
   
    return [counter_Arr,keys,cell_alive_count];     
}

/**
  * applying game rules for both alive(clicked) and dead cells
  *
  * @returns {array} update_ArrX                x of dead cell to update
  * @returns {array} update_ArrY                y of dead cell to update
  * @returns {array} update_clicked             the state to update the live cell to(either true stay alive or false goes dead )
  * @returns {array} update_clicked_position    position of live cell to update
 */


function rules() {
    var test_return = test();
    var count_Arr = test_return[0];
    var keys = test_return[1];
    var clicked_postion = getClickedCells();
    var clicked_cells_test = test_return[2];
    var update_ArrX = [];
    var update_ArrY = [];
    var q = 0;

    // for dead cells 
    for (let c = 0; c < count_Arr.length; c++) {
        for (let v = 0; v < 7; v++) {
            if(count_Arr[c][v] == 3){
                    key_val = keys[q];
                        var x = key_val.i , y = key_val.j;
                        update_ArrX.push(x);
                        update_ArrY.push(y);         
            } 
            q++;
        }
        q++;
    }


    var update_clicked = [];
    var update_clicked_position = [];
    // for alive cells
    for (let n = 0; n < clicked_postion.length; n++) {
        for (let z = 0; z < clicked_cells_test.length; z++) {
            if (clicked_cells_test[z] < 2) {
                update_clicked[z] = false ;
            }
            if (clicked_cells_test[z] == 2 || clicked_cells_test[z] == 3) {
                update_clicked[z] = true ;
            }
            if (clicked_cells_test[z] > 3) {
                update_clicked[z] = false ;
            }
            update_clicked_position[z] =  clicked_postion[z];
        }
    }

    return [update_ArrX , update_ArrY , update_clicked,update_clicked_position];
}

// finally, update cells state all together

function update() {
    var cells = rules();
    var x_val = cells[0];
    var y_val = cells[1];
    var clicked_stay_alive_state =  cells[2];
    var stay_alive_position = cells[3] 
    
    // update dead cells 
    for (let m = 0; m < clicked_stay_alive_state.length; m++) {
        if(clicked_stay_alive_state[m] == true){
            p = stay_alive_position[m].split(",").map((e) => parseInt(e));
            var i = p[0] , j = p[1];
            var aliveCellToUpdate = document.getElementById("td "+i+','+j)
            aliveCellToUpdate.setAttribute('class','tdcellalive');
        }
        else{
            p = stay_alive_position[m].split(",").map((e) => parseInt(e));
            var i = p[0] , j = p[1];
            var aliveCellToUpdate = document.getElementById("td "+i+','+j)
            aliveCellToUpdate.setAttribute('class','tdcellDead');
        }

    }

    // update alive cells
    for (let i = 0; i < x_val.length; i++) {
        var cellToUpdate = document.getElementById("td "+x_val[i]+','+y_val[i])
        cellToUpdate.setAttribute('class','tdcellalive');
    }
}