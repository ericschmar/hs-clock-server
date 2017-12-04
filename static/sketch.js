
function Circle(){
    this.x = primary_x
    this.y = primary_y
    this.goal = [0, 0]
    this.original = [0,0]
    this.diameter = small_circle_radius
    this.text = ""
    this.is_clicked = true
}

function setup() {   
    createCanvas(windowWidth, windowHeight);
    frameRate(60)
    angleMode(RADIANS)    
    c_x = windowWidth/2;
    c_y = windowHeight/2 + 100;
    b_diameter = 600;
    s_diameter = 300;
    b_radius = b_diameter / 2;
    s_radius = s_diameter / 2;
    small_circle_radius = 100;
    primary_x = c_x + b_radius
    primary_y = c_y

    circles = [new Circle(), new Circle(), new Circle(), new Circle(), new Circle()]
    top_decks = null
    deck_0 = ""
    deck_1 = ""
    deck_2 = ""
    deck_3 = ""
    deck_4 = ""
    decks = [deck_0, deck_1, deck_2, deck_3, deck_4]
    // fetch the top decks
    fetch("http://localhost:5000/top")
    .then(function(response) {
        return response.json()
    })
    .then(function(j) {
        temp_decks = j
        total = temp_decks["total"]
        top_decks = []
        //turn the JS object of objects into array of object
        Object.keys(temp_decks).forEach(function(key, index){
            if(key=="total") return
            top_decks.push({"name":key, "count":temp_decks[key].count})
        })
        //sort the top decks
        top_decks.sort(function(a, b) {return a.count < b.count})
        //add the name and percentage to the circles and decks arrays
        Object.keys(top_decks).forEach(function(key, index){
            if(key == "total") return 
            decks[index] = top_decks[index].name
            t = "" +((top_decks[key].count / total) * 100)
            circles[index].text = t.substring(0, 4)
        })
    })
    .catch(function(err) {
        console.log(err)
    })

    background(227, 204, 109)

    noStroke();
    fill(157, 231, 255, 220);
    generate_circle_locs()
    ellipse(circles[0].x, circles[0].y, small_circle_radius)
    fill(104, 71, 30, 220);
    ellipse(circles[1].x, circles[1].y, small_circle_radius)
    ellipse(circles[2].x, circles[2].y, small_circle_radius)
    ellipse(circles[3].x, circles[3].y, small_circle_radius)

    for(i = 0; i < circles.length; i++){
        seed_random_circle_loc(circles[i])
    }
}
  
function draw() {
    textSize(24);

    fill(227, 204, 109);
    rect(c_x - 750, c_y - 410, 1400, 810)
   
    noStroke();
    fill(104, 71, 30, 220);

    //draw the main circle which will always be the first one
    fill(157, 231, 255, 220);
    ellipse(circles[0].x, circles[0].y, circles[0].diameter)
    if(circles[0].is_clicked){
        fill(68, 46, 23, 250)
        text(circles[0].text + "%", circles[0].x - 30, circles[0].y + 10)
    }
    fill(68, 46, 23, 250)
    text(decks[0], circles[0].x + 30, circles[0].y - circles[0].diameter + 35)

    draw_all_circles()
    fill(68, 46, 23, 250)
    ellipse(c_x, c_y, 40, 40)
    
    time_step_circles()

    loadImage("static/hs-logo.png", function(img) {
        image(img, 10, 10, 200, 200);
      });
    noStroke();
    textSize(40);
    text("Hearthstone Meta Clock", 250, 125);
}

function draw_all_circles(){
    circles.forEach(function(c, index){
        //don't redraw the main circle
        if(index != 0) {
            //make the text to the upper right of these
            if(index == 1 || index == 2) {
                fill(68, 46, 23, 250)
                text(decks[index], circles[index].x + 30, circles[index].y - circles[index].diameter + 40)
            }
            //make the text to the lower right of these
            else {
                fill(68, 46, 23, 250)
                text(decks[index], circles[index].x + 40, circles[index].y + circles[index].diameter - 30)
            }

            ellipse(c.x, c.y, c.diameter)
            if(c.is_clicked){
                fill(157, 231, 255, 220);
                text(c.text + "%", c.x - 30, c.y + 10)
            }
        }
    })
}

//seed the new circle locations randomly, bounded by a 20x20 box around the original x, y
function seed_random_circle_loc(c){
    orig_x = c.original[0]
    orig_y = c.original[1]
    rand_x = random(orig_x - 20, orig_x + 20) 
    rand_y = random(orig_y - 20, orig_y + 20)
    c.goal[0] = rand_x
    c.goal[1] = rand_y
}

/*
Time step 0.15px of the distance to the goal location of each circle
*/
function time_step_circles(){
    for(i = 0; i < circles.length; i++){
        cur = circles[i]
        if(abs(cur.x - cur.goal[0]) < 3 || abs(cur.x - cur.goal[1]) < 3){
            seed_random_circle_loc(cur)
        }
        if((cur.x - cur.goal[0]) > 0){
            cur.x = cur.x - 0.15
        }
        else {
            cur.x = cur.x + 0.15
        }
        if((cur.y - cur.goal[1] > 0)){
            cur.y = cur.y - 0.15
        }
        else {
            cur.y = cur.y + 0.15
        }
    }
}

//generate the original x, y onto the large circle
function generate_circle_locs(){
    angles = [1.1, PI + 0.5, PI + 1, PI + 1.5, PI + 2]
    for(i = 0; i < circles.length; i++){
        n = rotato_potato(circles[i].x, circles[i].y, 0 - angles[i])
        if(circles[i].original[0] == 0){
            circles[i].original = [n[0], n[1]]
        }
        circles[i].x = n[0]
        circles[i].y = n[1]
    }
}

//function to place a circle correctly around the edge of a circle
function rotato_potato(x, y, angle){
    x1 = x - c_x
    y1 = y - c_y
    x_new = x1 * cos(angle) - y1 * sin(angle)
    y_new = x1 * sin(angle) + y1 * cos(angle)

    return [x_new + c_x, y_new + c_y]
}

/*
// function to detect if a circle was clicked on
function mouseClicked() {
    // Check if mouse is inside the circle
    var d = dist(mouseX, mouseY, 360, 200);
    for (i=0; i < circles.length; i++){
        d = dist(mouseX, mouseY, circles[i].x, circles[i].y)
        if (d < 100){
            console.log("moused over circle")
            circles[i].diameter = small_circle_radius + 50
            circles[i].is_clicked = true
            console.log(circles[i].text)
        }
        else {
            circles[i].diameter = small_circle_radius
            circles[i].is_clicked = false
        }
    }
}*/
