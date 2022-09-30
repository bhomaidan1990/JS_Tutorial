<template>
    <div id=plan>
        <div id="center" >
            <div id="planFlex">
                <i class="fa-solid fa-user fa-xl"></i>
                <i class="fa-solid fa-arrow-left fa-xl"></i>
                <h1 @click="addPopUp(testPopup, `Lego not in the right place`)">
                    Plan
                </h1>
                <i class="fa-solid fa-arrow-right fa-xl"></i>
                <i class="fa-solid fa-robot fa-xl"></i>
            </div>
            <ul id="planOl" v-if="showPlan">
                <PlanLego
                    v-for = "item in elements"
                    :v-if="item != activeStep"
                    :name = "item.name"
                    :text = "item.text"
                    :color = "item.color"
                    :size = "item.size"
                    :bgColor = "item.bgColor"
                    :legonames = "item.legonames"
                    :legoget = "item.legoget"
                    :legoplace= "item.legoplace"
                    :blocked= "item.blocked"
                    :key = "item.name"
                    @choose="planClick"
                    @remove="removeStep"
                    @error="addLogMessage(`Can't see the execution of pass step`, `orange`)"
                />
            </ul>
        </div>
        <div id="controlView">
            <div id="titleView">
                <h3 id="containerTableLink" style="background-color: #474444" 
                  class="tablinkView borderLink" @click="openView('containerTable')">
                    MainView
                </h3>
                <h3 id="subTableLink" class="tablinkView" @click="openView('subTable')">
                    ActionView
                </h3>
            </div>

            <div id=containerTable class = "view">
                <p class="triangle-isosceles" style="display:none" @click="openControlFromIssue()">
                     <i class="fa-solid fa-xmark fa-xl"></i>
                </p>
                <div id="messagePopup" style="display:none">
                    <div id="popupStatusBar" ></div>
                    <p></p>
                </div>
                <!-- there is the 3D inside -->
                <img id="lefthand" src="../assets/left-hand.png" alt="left-hand" width="100" height="100">
                <p>Left</p>
                <img id="righthand" src="../assets/right-hand.png" alt="right-hand" width="100" height="100">
                <p>Right</p>
            </div>

            <div id="subTable" class="view" style="display:none">
                <SubTableLego 
                    ref="child"
                    v-if="activeView == `subTable`"
                    :table ="subTable"
                    :legos ="subLegos"
                    :addLego="add_LEGO"
                    :pick="this.pick"
                    :place="this.place"
                    :key="rerenderer"
                />
            </div>
        </div>
   
        <div id="controlPannel">
            <div id="titleControl">
                <h3 id="controlsLink" style="background-color: #474444" 
                class="tablink borderLink" @click="openControl('controls')">
                    Controls
                </h3>
                <h3 id="logsLink" class="tablink" @click="openControl('logs')">
                    Logs
                </h3>
            </div>

            <div class="notifLog" id="notifred" v-if="logs_not_seen.red > 0"></div>
            <div class="notifLog" id="notiforange" v-else-if="logs_not_seen.orange > 0"></div>
            <div class="notifLog" id="notifwhite" v-else-if="logs_not_seen.white > 0"></div>
            
            <div id="controls" class="param">
                <div class="range tooltip" style="--step:10; --min:0; --max:100">
                    <h2>Speed of the robot</h2>
                    <input @input="updateSpeed(speedRobot)" v-model="speedRobot" type="range" min="0" max="100" step="10" value="50">
                    <div class="tooltiptext">Slide me to increase or decrease the speed of the robot</div>
                </div>
                <div id="startStop" class="startStop" @click="startStop()">
                    <div class="fondu" x="0" y="0" width="200" height="200"></div>
                    <div class="icone" width="200" height="200">
                        <div class="depart animation" x="0" y="0" width="200" height="200" fill="#fff"></div>
                        <div class="depart derecha" x="0" y="0" width="200" height="200" fill="#fff"></div>
                    </div>
                    <div class="puntero tooltip">
                        <div class="tooltiptext">Click me to stop/resume the execution</div>
                    </div>
                </div>
                <div id = "stopbutton" class ="tooltip">
                    <div class="boulon" id="boulon_hg"></div>
                    <div class="boulon" id="boulon_hd"></div>
                    <div class="boulon" id="boulon_bg"></div>
                    <div class="boulon" id="boulon_bd"></div>
                    <p id = "emergencytop">EMERGENCY STOP</p>
                    <p id = "emergencybot">EMERGENCY STOP</p>
                    <div class="bigcercle tooltip" @click="stopExecution()">
                        <div class="tooltiptext">Click me to interrupt the execution</div>
                    </div>
                    
                </div>
            </div>

            <div id="logs" class="param" style="display:none">
                <ul id="logUl">
                    <EventLego
                        v-for = "log in logs.slice().reverse()"
                        :name = "log.name"
                        :message = "log.message"
                        :color = "log.color"
                        :buttons = "log.buttons"
                        :key = "log.name+log.message"
                        :ref="`event-ref-̀`+log.name"
                        @cancelRemove ="cancelRemove"
                    />
                </ul>
            </div>
        </div>
    </div>

</template>

<script>
import * as THREE from 'three'
import PlanLego from "./PlanLego.vue"
import EventLego from "./EventLego.vue"
import SubTableLego from "./SubTableLego.vue"

export default {
    name:"TableLego",
    components:{
        PlanLego,
        EventLego,
        SubTableLego
    },
    data(){
        return{
            camera: null,
            scene: null,
            renderer: null,
            mesh: null,

            STUD_WIDTH: null,
            STUD_SPACING: null,
            PLATE_HEIGHT: null,
            STUD_HEIGHT: null,
            STUD_PADDING: null,// table sides
            STUD_NUM_SIDES: null,
            LEGO_HEIGHT: null,

            FloorWidth: null,
            FloorHeight: null,
            init_pos_x :null,
            init_pos_y :null,
            init_pos_z :null,

            init_rot_x :null,
            init_rot_y :null,
            init_rot_z :null,

            table_studs: null,
            stud_levels: null,

            elements: null,
            activeStep: null,
            speedRobot: 50,

            // this legos map contains the informations of the top legos in x,y coordinate
            legos: null,

            // this actions variable contains the current step
            lastActions: null,
            actions: null,
            humanActions: new Map(),

            // this next variable contains the place of the next lego
            next: null,

            // this legos map contains the informations of all the futures lego in x,y,z coordinate
            plan_legos: null,

            // this legos array contains the future lego we will take when we will go down
            get_legos: null,

            plan: null,

            ignore: false,

            htmlPlan: null,

            stop_robot: null,
        
            current: null,
            previous: null,

            first: true,

            activePlan: null,
            activeIssue: null,

            //variable for the blinking effect
            myVar: null,

            dir: null,
            sph: null,
            table: null,

            activeView: "containerTable",
            subTable: Object(),
            subLegos: new Map(),

            //variable for the animation
            id: null,
            grip: null,
            gripper_OG: null,
            prev_OG: null,
            speed: 0.7,
            distance_beg: 15,
            goal: null,
            animate: false,
            olds: null,
            
            pick: new Array(),
            place: new Array(),

            showPlan: true,
            logs: Array(),
            logs_not_seen: {
                red:0,
                orange:0,
                white:0
            },

            //for testing
            it_test: 2,
            testPopup: "p_00_26_0",

            rerenderer: 1,

            logIssue: null
        }
    },
    methods:{
        init: function(){

            this.objects = [];

            let container = document.getElementById('containerTable');
            

            this.elements = new Array();

            this.legos = new Map();

            // this variable contains the next action the robot will do
            this.actions = 0;

            // this legos map contains the informations of all the futures lego in x,y,z coordinate
            this.plan_legos = new Map();

            this.get_legos = new Array();

            this.next = new Array();

            this.goal = new Array();

            this.plan = new Array();

            this.htmlPlan = document.getElementById('center');

            this.prev_OG = undefined;

            this.olds = new Array();

            this.stop_robot = false;
        
            this.current = undefined;
            this.previous = undefined;

            this.myVar = undefined;

            this.render_animate_selected();

            this.renderer.setAnimationLoop(() => {
                this.renderer.render(this.scene, this.camera);
            });
        },
        /*
            this function take in entry the json sent by the robot, and it will update all of the scene
            with the variable.
        */
        read_robot_input( file_data = "../data/data.json", file_plan = "../data/plan.json"){

            //check if a key is used in order to delete legos removed
            let legos_checked = new Array();
            
            //if we need to update the lego
            let update = false;

            //to avoid animation issues
            let incr = false;
            this.animate = false;

            //get the json file and parse it
            var instance = this;
            fetch(file_data).then(function(resp) {
                return resp.json();
            }).then(function(data) { 
                //Iterate trought object receive
                Object.keys(data).forEach(key => {
                    legos_checked.push(key);
                    //Split for the position
                    let char = key.split('');

                    //get the position of the current lego
                    let position = {
                        x: parseInt(char[5] + char[6]) - instance.FloorWidth / 2,
                        y: -(parseInt(char[2] + char[3]) - instance.FloorHeight / 2),
                        z: parseInt(data[key][1])
                    }

                    //Type of the lego, other - previous - current, if the key is the one who be place, we set the type to previous
                    let type = "other";
                    if (instance.legos.get(key) == undefined || JSON.stringify(instance.legos.get(key)["position"]) != JSON.stringify(position) || instance.legos.get(key)["type"] != type){
                        update = true;
                        //color
                        let color = instance.getColorFromData(data[key][0]);

                        //Create an lego with the informations
                        var lego = {
                            type: type,

                            position: position,

                            color: color,

                            name: key + "_" + position["z"]
                        }

                        //If we remove one lego
                        if (instance.legos.get(key) != undefined) {
                            let difference = lego["position"]["z"] - instance.legos.get(key)["position"]["z"];
                            if (difference < 0) {
                                for (let i = 0; i < Math.abs(difference); i++) {
                                    let delpos = instance.legos.get(key)["position"]["z"] - i;
                                    let delname = lego["name"].substring(0, 8);
                                    delname = delname + delpos.toString();
                                    let obj = instance.scene.getObjectByName(delname);
                                    instance.scene.remove(obj)
                                }
                            }
                        }
                        
                        //we add the lego to the scene
                        let tmp = instance.add_LEGO(lego["color"],
                            1,
                            1,
                            lego["position"]["x"],
                            lego["position"]["y"],
                            lego["position"]["z"],
                            instance.scene,
                            false,
                            lego["type"],
                            lego["name"],
                            false);

                        lego["lego"] = tmp;
                        //add to the map
                        instance.legos.set(key, lego);
                            
                        //for making human plan passed    
                        if (instance.humanActions.get(lego["name"]) != undefined){
                            instance.elements[instance.humanActions.get(lego["name"])].bgColor = "#141414";
                            instance.elements[instance.humanActions.get(lego["name"])].blocked = true;
                            instance.humanActions.delete(lego["name"]);
                        }

                        if (instance.next.includes(lego["name"])){
                            let i = 1;
                            if (!incr){
                                incr = true; 
                                
                                while(instance.elements[instance.actions+i].text == 'Participant' && instance.actions+i+1 < instance.elements.length){
                                    instance.humanActions.set(instance.elements[instance.actions+i].legonames.split(' ')[1], instance.actions+i);
                                    i++;
                                }
                                instance.lastActions = instance.actions;
                                if (instance.actions+i+1 < instance.elements.length){
                                    instance.actions += i;  
                                } else{
                                    instance.ignore = true;
                                }
                            }
                            instance.animate = true;
                            instance.goal.push(tmp);
                        }
                    }
                });

                //check if one block is no more on the table and if then remove it
                for (let [key] of instance.legos){
                    if (legos_checked.includes(key) == false){
                        instance.scene.remove(instance.legos.get(key)["lego"]);
                        instance.legos.delete(key);
                    }
                }
                //update the lego and the goal who will be choose by the robot
                if (update){
                    instance.updatePlan(file_plan);
                } else{
                    //for now it's testing time
                    instance.test(); 
                }
            });
        },
        updatePlan(file_plan){
            var instance = this;

            //this if to change when the plan file is update
            //eslint-disable-next-line
            if (true) {
                fetch(file_plan).then(function(resp) {
                    return resp.json();
                }).then(function(data) {
                    instance.plan = data;
                    instance.updateLegos();
                });
            } else {
                instance.updateLegos();
            }
        },
        updateLegos(){

            let get_name = "";

            let old;

            let size = 0;

            this.olds = [];

            //we have to change the context for the first time or if there was a changement
            if (this.animate || this.first){
                this.next = [];
                //clear the previous tables
                for (const [key] of this.plan_legos.entries()){
                    if ((key == this.plan_legos.entries().next().value[0] || (old != undefined && old["width"] > size))){
                        this.scene.remove(this.get_legos[size/2]);
                        old = this.plan_legos.get(key);
                        size += 2;
                        this.olds.push(old["lego"]);
                    }else{
                        this.scene.remove(this.plan_legos.get(key)["lego"]);
                    }
                }
                for (let i = 0; i < this.get_legos.length; i++){
                    for (let j = 0; j < this.get_legos[i].length; j++){
                        this.get_legos[i][j].children.splice( 17,  this.get_legos[i][j].children.length-1);
                    }
                }
                this.get_legos = [];
                this.plan_legos.clear();

                //iterate throught the next action to the last step of plan
                for (let i = this.actions; i < this.plan.length; i++) {
                    
                    let key = Object.keys(this.plan[i]);
                    let step = this.plan[i][key];

                    let legplace = new Array();

                    let names = "";
                    let color = "";
                    let width= step[0].charAt(6);
                    
                    //FOR THE BLINKING LEGOS
                    //set the blinking one 
                    //get the good place in the array
                    let place = 1;
                    if (step[2] != undefined) {
                        place = 2;
                    }

                    //get only the good information to an array
                    let positions = step[place].split(" ");
                    let positions_choose = "";

                    //get the color
                    let col = positions[1].charAt(0);
                    color = this.getColorFromData(col);
                    positions.splice(0, 2);

                    //add blink at good position
                    for (let j = 0; j < positions.length; j++) {

                        let name = positions[j];

                        names += " "+name;
                        
                        if (i == this.actions){
                            this.next.push(name);
                        }
                        let position = {
                            x: parseInt(positions[j].charAt(5) + positions[j].charAt(6)) - this.FloorWidth / 2,
                            y: -(parseInt(positions[j].charAt(2) + positions[j].charAt(3)) - this.FloorHeight / 2),
                            z: parseInt(positions[j].charAt(8))
                        }

                        let lego = {
                            type: "current",

                            position: position,

                            color: color,

                            name: name,

                            width: width
                        }
                        legplace.push(lego);


                        //FOR THE CHOOSE LEGOS
                        positions_choose = step[0].split(' ');
                        positions_choose.splice(0,2);
                        get_name = positions_choose;

                        if (i == this.actions && !this.ignore){
                            lego["lego"] = this.add_LEGO(
                                lego["color"],
                                1,
                                1,
                                lego["position"]["x"],
                                lego["position"]["y"],
                                lego["position"]["z"],
                                this.scene,
                                false,
                                lego["type"],
                                lego["name"],
                                false
                            );
                            this.plan_legos.set(lego["name"], lego);

                            let tmp = new Array();
                            for (let j = 0; j < positions_choose.length; j++){
                                let name = positions_choose[j];
                                let obj = this.scene.getObjectByName(name);
                                let width = this.computePlateLength(1);
                                this.draw_borders(obj, width, width, "black", 3);
                                tmp.push(obj);
                            }

                            this.get_legos.push(tmp);
                        }
                    }
                    let text;
                    if (key[0][1] == "l"){
                        text = "Robot left arm"
                    } else if (key[0][1] == "r"){
                        text = "Robot right arm"
                    } else if (key[0][1] == "h"){
                        text = "Participant"
                    }
                    //for the plan at the left
                    let element = {
                        name: i+1,
                        color : color,
                        text: text,
                        size: width,
                        bgColor: "#474444",
                        legonames: names,
                        legoget: get_name,
                        legoplace: legplace,
                        blocked: false
                    }
                    let exist = false;
                    for (let i = 0; i < this.elements.length; i++){
                        if (this.elements[i].legonames == element.legonames){
                            exist = true;
                        }
                    }
                    if(!exist) {
                        this.elements.push(element);
                    }   
                }
                if (!this.ignore){
                    this.elements[this.actions].bgColor = "blink";
                    if (this.elements[this.actions].text.includes("right")){
                        document.getElementById('lefthand').classList.remove("blink-bg");
                        document.getElementById('righthand').classList.add("blink-bg");
                    } else{
                        document.getElementById('righthand').classList.remove("blink-bg");
                        document.getElementById('lefthand').classList.add("blink-bg");
                    }
                }
            }

            if (this.first){
                this.first = false;
            }
            if (this.animate){
                this.elements[this.lastActions].bgColor = "OrangeRed";
                this.activePlan = this.elements[this.lastActions];

                for (let i = 0; i < this.olds.length; i++){
                    for (let obj of this.olds[i].children) {
                        obj.material.transparent = true;
                        obj.material.opacity = 0.5;
                        obj.material.alphaTest = 0.1;
                    }
                    this.olds[i].material.transparent = true;
                    this.olds[i].material.opacity = 0.5;
                    this.olds[i].material.alphaTest = 0.1;
                }
                this.gripDown();
            } else{
                this.test();
            }
        },
        addLight(scene) {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(0, 10, 0);
            light.target.position.set(-5, 0, 0);
            scene.add(light);
            scene.add(light.target);
        },
        computePlateLength(studs) {
            return this.STUD_PADDING * 2 + studs * (this.STUD_WIDTH + this.STUD_SPACING) - this.STUD_SPACING
        },
        createFloor(dim_x, dim_y, scene){
            let x = this.computePlateLength(dim_x);
            let y = this.computePlateLength(dim_y);
            var geometry = new THREE.BoxGeometry(x, this.PLATE_HEIGHT, y);
            var material = new THREE.MeshBasicMaterial({ color: 0x008f00 });
            this.table = new THREE.Mesh(geometry, material);
            this.table.userData.name = 'table';

            scene.add(this.table);
            return this.addTableStuds(dim_x, dim_y, scene);
        },
        addTableStuds(dim_x, dim_y){
            let x = this.computePlateLength(dim_x);
            let y = this.computePlateLength(dim_y);

            let stud_levels = [];

            for (var i = 0; i < dim_x; i++) {
                stud_levels.push([]);
                for (var j = 0; j < dim_y; j++) {
                    let stud = new THREE.Mesh(new THREE.CylinderGeometry(this.STUD_WIDTH / 2, this.STUD_WIDTH / 2, this.STUD_HEIGHT, this.STUD_NUM_SIDES), new THREE.MeshLambertMaterial({ color: 0x008f00 }));
                    stud.position.y = this.PLATE_HEIGHT + this.STUD_HEIGHT / 2
                    stud.position.x = this.STUD_WIDTH / 2 + this.STUD_PADDING + i * (this.STUD_WIDTH + this.STUD_SPACING) - x / 2
                    stud.position.z = this.STUD_WIDTH / 2 + this.STUD_PADDING + j * (this.STUD_WIDTH + this.STUD_SPACING) - y / 2

                    stud_levels[i].push(0);
                    stud.userData.id = i + "_" + j;
                    this.table.add(stud);
                    this.table_studs.push(stud);
                }
            }
            this.subTable = this.table.clone();
            return stud_levels;
        },
        render_animate_selected(){
            clearInterval(this.myVar);
            this.myVar = setInterval(this.blink_effect, 1000);
        },
        blink_effect() {
            this.plan_legos.forEach((value) => {
                let lego = value["lego"];
                let t = lego.material.opacity;
                let alphaTest;
                if (t == 1) {
                    t = 0.4;
                    alphaTest = 0.1;
                } else {
                    t = 1;
                    alphaTest = 0;
                }

                for (let obj of lego.children) {
                    obj.material.transparent = true;
                    obj.alphaTest = 0.1;
                    obj.material.opacity = t;
                    obj.material.alphaTest = alphaTest;
                }

                lego.material.transparent = true;
                lego.material.opacity = t;
                lego.material.alphaTest = alphaTest;
            })
        },
        getColorFromData(color_){
            //Choose the color
            let color;
            switch (color_) {
                case 'b':
                    color = "blue";
                    break;
                case 'g':
                    color = "green";
                    break;
                case 'r':
                    color = "red";
                    break;
                case 'y':
                    color = "yellow";
                    break;
                case 'o':
                    color = "olive";
                    break;
                case 'l':
                    color = "light_green";
                    break;
                case 'w':
                    color = "white";
                    break;
                default:
                    color = "black";
                    break;
            }
            return color;
        },
        getColor(val){
            var codes = {
                black: 0x191a1b,
                white: 0xfafafa,
                green: 0x00b300,
                red: 0xd10000,
                blue: 0x003399,
                yellow: 0xe6e600,
                olive: 0x808000,
                light_green: 0x90EE90,
                grey: 0x808080
            }
            return codes[val];
        },
        get_dark_Color(val){
            var codes = {
                black: 0x191a1b,
                white: 0xfafafa,
                green: 0x0D930D,
                red: 0xC31E1E,
                blue: 0x0C1F7F,
                yellow: 0xD2DA1D,
                olive: 0x556B2F,
                light_green: 0x8FBC8F
            }
            return codes[val];
        }, 
        gripDown() {

            //get the position of the previous lego
            this.prev_OG = Object();
            Object.assign(this.prev_OG, this.goal[0].position);

            //add a gripper at the right place
            this.gripper = this.add_gripper("grey", this.prev_OG, "horizontal", this.scene);

            //where the gripper will start
            for (let i = 0; i < this.goal.length; i++){
                this.goal[i].position.y *= this.distance_beg;
            }
            this.gripper.position.y += (this.goal[0].position.y - this.prev_OG.y);

            //create the gripper and run animation
            this.gripper_OG = Object();
            Object.assign(this.gripper_OG, this.gripper.position);
            this.animate_down();
        },
        animate_down() {

            //we get the number of the actual animation frame
            this.id = requestAnimationFrame(this.animate_down);

            //show it on screen
            this.renderer.render(this.scene, this.camera);

            //If it's finish
            if (this.goal[0].position.y <= this.prev_OG.y) {
                for (let i = 0; i < this.goal.length; i++){
                    this.goal[i].position.y = this.prev_OG.y;
                }
                cancelAnimationFrame(this.id);
                this.animate_up();
            } else {
                //update position for next frame
                for (let i = 0; i < this.goal.length; i++){
                    this.goal[i].position.y -= this.prev_OG.y / this.speed;
                }
                this.gripper.position.y -= this.prev_OG.y / this.speed;
            }

        },
        animate_up() {
            this.id = requestAnimationFrame(this.animate_up);

            this.renderer.render(this.scene, this.camera);


            if (this.gripper.position.y >= this.gripper_OG.y) {

                cancelAnimationFrame(this.id);

                //remove the gripper
                this.scene.remove(this.gripper);

                //remove the lego here
                for (let i = 0; i < this.olds.length; i++){
                    this.scene.remove(this.scene.remove(this.olds[i]));
                }


                this.goal = [];

                this.colorPassStep();

                //actualize legos
                this.test(); //for now it's testing time but then I have just to call read_robot_input();
            } else {
                this.gripper.position.y += this.prev_OG.y / this.speed;
            }

        },
        planClick(event){
            this.resetBg();
            document.getElementById(event.name).style.backgroundColor = "cyan";
            this.pick = [];
            for(let i = 0; i < event.get.length; i++){
                this.pick.push("c"+event.get[i])
            } 
            this.place = event.place;
            
            this.updateSubLegos();
            this.openView("subTable");
            
        },
        resetBg(){
            let plans = document.getElementsByClassName("planLegoUl");
            
            for (let i = 0; i < plans.length; i++){
                plans[i].style.backgroundColor = "dimgray";
            }
        },
        updateSubLegos(){
            for (const [key] of Object.entries(this.scene.children)) {
                if (this.scene.children[key].name.includes('p_')){
                    let subLego = {
                        lego : this.scene.children[key].clone(),
                        name: "c"+this.scene.children[key].name
                    }
                    subLego["lego"].name = subLego["name"];
                    subLego["lego"].material = this.scene.children[key].material.clone();
                    for (let i = 0; i < this.scene.children[key].children.length; i++){
                        subLego["lego"].children[i].material = this.scene.children[key].children[i].material.clone(); 
                    }
                    this.subLegos.set(key,subLego);
                }
            }
        },
        removeStep(event){
            let stepNumber = parseInt(event.name);
            let actor;
            if (event.side == "left"){
                actor = "participant"
            }else{
                actor = "robot"
            }
            this.addLogMessage("The step number " + (stepNumber+1) + " is now assigned to " + actor, "white")
            let step = "sl"+event.name + " " + actor;
            var url = window.location.protocol +"//"+window.location.host+"/json.php";
            this.axios.get(url, {params: {
                type : "action",
                action : step
            }})
        },
        cancelRemove(event){
            let step = "+sl"+event.name;
            var url = window.location.protocol +"//"+window.location.host+"/json.php";
            this.axios.get(url, {params: {
                type: "action",
                action : step
            }})
        },
        startExecution(){
            this.stop_robot = false;
            this.read_robot_input();
        },
        stopExecution(){
            var url = window.location.protocol +"//"+window.location.host+"/json.php";
            this.axios.get(url, {params: {
                type : "state",
                state : "stop"
            }})
        },
        startStop(){
            let state;
            document.getElementById('startStop').classList.toggle('active')
            if(document.getElementById('startStop').classList[1] != undefined){
                this.startExecution();
                state = "normal";
            }else{
                state = "break";
            }
            var url = window.location.protocol +"//"+window.location.host+"/json.php";
            this.axios.get(url, {params: {
                type : "state",
                state : state
            }})
        },
        resetCamera(){
            if (this.activeView == "containerTable"){
                this.scene.rotation.set(0, 0, 0);
                this.camera.position.set(35, 110, 85);
                if (this.activeIssue != null){
                    this.addPopUp(this.activeIssue.position, this.activeIssue.text, this.activeIssue.color, false);
                }
            }else{
                this.$refs.child.scene.rotation.set(0, 0, 0);
                this.$refs.child.camera.position.set(35, 110, 85);     
                this.$refs.child.renderer.render( this.$refs.child.scene, this.$refs.child.camera );     
            }

        },
        rotateCamera(rx, ry){
            var new_rot_x;
            var new_rot_y;
            var new_rot_z;
            if (this.activeView == "containerTable"){
                new_rot_x = this.scene.rotation.x + rx;
                new_rot_y = this.scene.rotation.y + ry;
                new_rot_z = this.scene.rotation.z;

                this.scene.rotation.set(new_rot_x, new_rot_y, new_rot_z);
                if (this.activeIssue != null){
                    this.addPopUp(this.activeIssue.position, this.activeIssue.text, this.activeIssue.color, false);
                }
            } else if (this.$refs.child != undefined) {
                new_rot_x = this.$refs.child.scene.rotation.x + rx;
                new_rot_y = this.$refs.child.scene.rotation.y + ry;
                new_rot_z = this.$refs.child.scene.rotation.z;

                this.$refs.child.scene.rotation.set(new_rot_x, new_rot_y, new_rot_z);
                this.$refs.child.renderer.render( this.$refs.child.scene, this.$refs.child.camera );
            }

        },
        moveCamera(dx, dz){
            var new_pos_x = this.camera.position.x + dx;
            var new_pos_y = this.camera.position.y;
            var new_pos_z = this.camera.position.z + dz;

            this.camera.position.set(new_pos_x, new_pos_y, new_pos_z);
            if (this.activeIssue != null){
                this.addPopUp(this.activeIssue.position, this.activeIssue.text, this.activeIssue.color, false);
            }
        },
        zoomCamera(away = false){
            var new_pos_x;
            var new_pos_y;
            var new_pos_z;
            if (this.activeView == "containerTable"){
                if (!away){

                    new_pos_x = this.camera.position.x;
                    new_pos_y = this.camera.position.y + 10;
                    new_pos_z = this.camera.position.z + 5;

                    this.camera.position.set(new_pos_x, new_pos_y, new_pos_z);
                } else{
                    new_pos_x = this.camera.position.x;
                    new_pos_y = this.camera.position.y - 10;
                    new_pos_z = this.camera.position.z - 5;

                    this.camera.position.set(new_pos_x, new_pos_y, new_pos_z);
                }
                if (this.activeIssue != null){
                    this.addPopUp(this.activeIssue.position, this.activeIssue.text, this.activeIssue.color, false);
                }
            } else{
                if (!away){

                    new_pos_x = this.$refs.child.camera.position.x;
                    new_pos_y = this.$refs.child.camera.position.y + 10;
                    new_pos_z = this.$refs.child.camera.position.z + 5;

                    this.$refs.child.camera.position.set(new_pos_x, new_pos_y, new_pos_z);
                } else{
                    new_pos_x = this.$refs.child.camera.position.x;
                    new_pos_y = this.$refs.child.camera.position.y - 10;
                    new_pos_z = this.$refs.child.camera.position.z - 5;

                    this.$refs.child.camera.position.set(new_pos_x, new_pos_y, new_pos_z);
                }
                this.$refs.child.renderer.render(this.$refs.child.scene, this.$refs.child.camera);
            }
            
        },
        tooglePlan(){
            if (this.showPlan){
                this.showPlan = false;  
            }else{
                this.showPlan = true;
            }
        },
        openView(view){
            if (this.activeView == "subTable"){
                this.$refs.child.destroy(this);    
            }

            if (view == "containerTable"){
                this.resetBg();
            }
            this.activeView = view;
            var i, x, tablinks;
            x = document.getElementsByClassName("view");
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablinkView");
            for (i = 0; i < x.length; i++) {
                tablinks[i].style.backgroundColor = "#575555";
                tablinks[i].classList.remove("borderLink");
            }
            if (view == "subTable"){
                this.updateSubLegos();
                this.rerenderer = -this.rerenderer;
            }
            document.getElementById(view).style.display = "block";
            view+="Link";
            document.getElementById(view).style.backgroundColor = "#474444";
            document.getElementById(view).className += " borderLink";
        },
        openControl(control){
            var i, x, tablinks;
            x = document.getElementsByClassName("param");
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablink");
            for (i = 0; i < x.length; i++) {
                tablinks[i].style.backgroundColor = "#575555";
                tablinks[i].classList.remove("borderLink");
            }
            let display = "block"
            if (control == "controls"){
                display= "flex";
            }
            document.getElementById(control).style.display = display;
            control+="Link";
            document.getElementById(control).style.backgroundColor = "#474444";
            document.getElementById(control).className += " borderLink";
            if (control == "logsLink"){
                this.logs_not_seen["red"] = 0;
                this.logs_not_seen["orange"] = 0;
                this.logs_not_seen["white"] = 0;
            }
            
        },
        addLogMessage(message, color="white", buttons = {}){
            let log = {
                message: message,
                color: color,
                name: this.logs.length,
                buttons: buttons
            }
            if (document.getElementById('logs').style.display == "none"){
                this.logs_not_seen[log.color]++;
            }
            
            this.logs.push(log);

            return log.name;
        },
        addPopUp(position, text, message = true){
            this.activeIssue = {
                position : position,
                text : text
            }
            document.getElementById('messagePopup').style.display = "";
            document.getElementById('messagePopup').children[1].innerHTML = text;
            setTimeout(function(){
                document.getElementById('messagePopup').style.display = "none";
            }, 5000)
            let elem = document.getElementsByClassName('triangle-isosceles')[0];
            elem.style.display = ""
            elem.style.width = "40px";


            let container = document.getElementById('containerTable');
            let cube = this.scene.getObjectByName(position);
            let vect = new THREE.Vector3();
            cube.updateWorldMatrix(true, false);
            cube.getWorldPosition(vect);

            vect.project(this.camera);

            let x = vect.x = ( vect.x + 1) * container.clientWidth / 2 -  (parseInt(elem.style.width, 10)/2);
            let y = (vect.y * -0.5 + 0.5) * container.clientHeight;
            elem.style.transform = `translate(0%, -150%) translate(${x}px,${y}px)`;
            if (message){
                this.logIssue = this.addLogMessage(text, "red");
            }
            this.test2();
        },
        openControlFromIssue(){
            this.activeIssue = null;
            document.getElementById('messagePopup').style.display = "none";
            document.getElementsByClassName('triangle-isosceles')[0].style.display = "none";
            this.openControl("logs");
            let elem = this.$refs["event-ref-̀"+this.logIssue][0].$el;
            elem.classList.add("target-highlight");
            setTimeout(function(){
                elem.classList.remove("target-highlight");
            }, 3000);
        },
        updateSpeed(speedRobot){
            var url = window.location.protocol +"//"+window.location.host+"/json.php";

            this.axios.get(url, {params: {
                type: "speed",
                speed: speedRobot
            }})
        },
        colorPassStep(){
            let instance = this;
            setTimeout(function(){
                instance.activePlan.bgColor = "#141414"
                instance.activePlan.blocked = true;
                document.getElementById('center').scrollTop += 20;
            }, 1000)
        },
        test(){
            setTimeout(function(instance){
                if (instance.it_test <= 8){
                    let file = '../data/data' + instance.it_test + ".json";
                    instance.it_test++;
                    instance.read_robot_input(file);
                }
            }, 3000, this);
        },
        test2(){
            let tomodify = this.testPopup[2]+this.testPopup[3];
            let modified = parseInt(tomodify)+2;
            let string = ""
            if (modified < 10){
                string = "0"+modified;
            } else{
                string = modified.toString();
            }
            this.testPopup = "p_"+string+"_26_0";
        }
    },
    mounted(){
        this.init();
        let result
        while(result == null || result == ""){
            result = prompt("Please enter your id:", "0425472271");
        }
        var url = window.location.protocol +"//"+window.location.host+"/json.php";
        var instance = this;
        this.axios.get(url, {params: {
            type: "id",
            id : result
        }}).then(function(){
            let message = "Execution started correctly"
            instance.addLogMessage(message);
            message = "Remove last lego"
            instance.addLogMessage(message, "red");
            message = "You are slow, the robot will go faster"
            instance.addLogMessage(message, "orange");

        }).catch(function(){
            let message = "Execution started without user data";
            instance.addLogMessage(message, "orange");
        })
    },
}
</script>

<style>
    @import '../styles/TableLego.css';
</style>