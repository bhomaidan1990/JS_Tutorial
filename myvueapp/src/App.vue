<template>
    <div name="First Lesson">
        <HelloWorld :title="title" />
        <!-- <card-component :title="[1, 2, 3, 4]" description="Lorem Something" /> -->
        <!-- <card-component :title="['Header', 'Is', 'Cool']" description="Lorem Another" />
        <card-component title="My Header 3" description="Lorem Last" /> -->
        <LayoutComponent>
            <card-component title="My Header" description="Lorem Something" />

            <template v-slot:afterFooter>
                <p>Maestro &copy;</p>
            </template>

        </LayoutComponent>

        <!-- <LayoutComponent>        
        </LayoutComponent> -->
    </div>
    <div name = "Second Lesson">
        <p> {{isSwitchedOn ? "💡":"Off"}} </p>
        <button @click="changeSwitch">
            {{isSwitchedOn ? "Switch Off" : "Switch On"}}        
        </button>
        <div>
            <br>
            <p>{{myName}}</p>
            <input type="text" @keyup="logToConsle" ref="input">
            <br>
            <button @click="handleRef">Handle Ref</button>
        </div>
    </div>

</template>

<script>

    import CardComponent from "./components/CardComponent.vue";
    import HelloWorld from "./components/HelloWorld.vue";
    import LayoutComponent from "./components/LayoutComponent.vue";

    export default {
        name: "App",
        components: {
            HelloWorld,
            CardComponent,
            LayoutComponent,
        },
        data() {
            return {
                title: "VueJS Lesson",
                isSwitchedOn: false,
                myName: "",
            };
        },
        methods: {
            changeSwitch(){
                this.isSwitchedOn = !this.isSwitchedOn
            },
            logToConsle(e){
                this.myName = e.target.value
            },
            handleRef(){
                this.$refs.input.focus();
                if(this.$refs.input.classList.contains("custom_style")){
                    this.$refs.input.classList.remove("custom_style")
                }
                else{this.$refs.input.classList.add("custom_style")}
            }
        }
    };

</script>

<style>

    @import "./styles/App.css";

</style>