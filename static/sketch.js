
function Circle(){
    this.x = primary_x
    this.y = primary_y
    this.goal = [0, 0]
    this.original = [0,0]
}


function setup() {   
    createCanvas(windowWidth, windowHeight);
    frameRate(15)
    angleMode(RADIANS)
    c_x = windowWidth/2;
    c_y = windowHeight/2 + 100;
    b_diameter = 650;
    s_diameter = 300;
    b_radius = b_diameter / 2;
    s_radius = s_diameter / 2;
    small_circle_radius = 100;
    primary_x = c_x + b_radius
    primary_y = c_y
    //circles = [{"x": primary_x, "y": primary_y}, {"x":c_x - b_radius, "y":c_y},
                //{"x":c_x, "y": c_y + b_radius}, {"x":c_x, "y": c_y - b_radius}]
    circles = [new Circle(), new Circle(), new Circle(), new Circle()]

    background(227, 204, 109)

    noStroke();
    fill(104, 71, 30, 220);
    n = rotato_potato(circles[0].x, circles[0].y, 0 - 1.1)
    ellipse(n[0], n[1], small_circle_radius);
    fill(50);
    text("Tempo Rogue", c_x + b_radius + 55, c_y);
    fill(104, 71, 30, 220);

    generate_circle_locs()
    ellipse(circles[1].x, circles[1].y, small_circle_radius)
    ellipse(circles[2].x, circles[2].y, small_circle_radius)
    ellipse(circles[3].x, circles[3].y, small_circle_radius)

    for(i = 0; i < circles.length; i++){
        seed_random_circle_loc(circles[i])
        console.log(circles[i].goal)
    }
}
  
function draw() {
    textSize(16);

    fill(227, 204, 109);
    rect(c_x - 750, c_y - 400, 1400, 800)

    stroke(0);
    fill(255, 0);
    // big main circle
    ellipse(c_x, c_y, b_diameter, b_diameter);
    // smaller main circle 
    ellipse(c_x, c_y, s_diameter, s_diameter)
    // small circles 
    // color, then alpha value
    
    noStroke();
    fill(104, 71, 30, 220);
    n = rotato_potato(circles[0].x, circles[0].y, 0 - 1.1)
    ellipse(n[0], n[1], small_circle_radius);
    /*
    fill(50);
    text("Tempo Rogue", c_x + b_radius + 55, c_y);
    */
    fill(104, 71, 30, 220);

    //generate_circle_locs()
    ellipse(circles[1].x, circles[1].y, small_circle_radius)
    ellipse(circles[2].x, circles[2].y, small_circle_radius)
    ellipse(circles[3].x, circles[3].y, small_circle_radius)

    ellipse(c_x, c_y - s_radius, 60, 60)
    
    time_step_circles()
    push();

    fill(0);
    rect(c_x, c_y, b_radius, 2);
    rect(c_x, c_y, 2, 0 - s_radius);
    pop();
    
    loadImage("static/hs-logo.png", function(img) {
        image(img, 0, 0, 200, 200);
      });
    noStroke();
    textSize(40);
    text("Hearthstone Meta Clock", 250, 125);
}

function seed_random_circle_loc(c){
    print(c)
    orig_x = c.original[0]
    orig_y = c.original[1]
    rand_x = random(orig_x - 35, orig_x + 35) 
    rand_y = random(orig_y - 35, orig_y + 35)
    console.log("seed" + " " + rand_x + " " + rand_y)
    c.goal[0] = rand_x
    c.goal[1] = rand_y
}

/*
Time step 1px of the distance to the goal location of each circle
*/
function time_step_circles(){
    console.log("time step")
    for(i = 1; i < circles.length; i++){
        cur = circles[i]
        if(ceil(cur.x) == ceil(cur.goal[0]) && ceil(cur.y) == ceil(cur.goal[1])){
            seed_random_circle_loc(cur)
            console.log("reseting location")
        }
        if((cur.x - cur.goal[0]) > 0){
            cur.x = cur.x - 1
        }
        else {
            cur.x = cur.x + 1
        }
        if((cur.y - cur.goal[1] > 0)){
            cur.y = cur.y - 1
        }
        else {
            cur.y = cur.y + 1
        }
    }
}

function generate_circle_locs(){
    angles = [PI + 0.5, PI + 1, PI + 1.5]
    for(i = 1; i < circles.length; i++){
        n = rotato_potato(circles[i].x, circles[i].y, 0 - angles[i - 1])
        if(circles[i].original[0] == 0){
            circles[i].original = [n[0], n[1]]
            console.log("update" + " " + circles[i].original[0] + " " + circles[i].original[1])
        }
        circles[i].x = n[0]
        circles[i].y = n[1]
    }
}

function rotato_potato(x, y, angle){
    x1 = x - c_x
    y1 = y - c_y
    x_new = x1 * cos(angle) - y1 * sin(angle)
    y_new = x1 * sin(angle) + y1 * cos(angle)

    return [x_new + c_x, y_new + c_y]
}

function mouseClicked() {
    // Check if mouse is inside the circle
    var d = dist(mouseX, mouseY, 360, 200);
    for (i=0; i < circles.length; i++){
        d = dist(mouseX, mouseY, circles[i].x, circles[i].y)
        if (d < 100){
            console.log("moused over circle")

        }
    }
}
