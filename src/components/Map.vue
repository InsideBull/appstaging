<template>
<v-app id="inspire">
    <!--Toolbar-->
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="#5ac4bb" dark app fixed>
        <v-toolbar-title>
            <span><router-link to="/">MapAnyPlace</router-link></span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="#5ac4bb" @click="showForm()">
            <span>Sign in</span>
        </v-btn>
        <v-dialog v-model="dialog" width="500">
            <v-card class="sign" light>
                <v-card-title class="title">
                    Sign in
                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field label="Email" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="Password" type="password" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12>
                                <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Age" required></v-select>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click.native="dialog = false">Cancel</v-btn>
                    <v-btn color="#5ac4bb" flat @click.native="dialog = false">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-toolbar>
    <!--End toolbar-->

    <!--Navigation drawer for menu-->
    <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app v-cloak>
        <v-list dense>
            <v-expansion-panel popout>
                <!--Location menu-->
                <v-expansion-panel-content>
                    <div slot="header" class="item">Design the map</div>
                    <v-card>
                        <v-container grid-list-md>
                            <v-flex xs12 sm12>
                                <div id="geocoder" class="geocoder"></div>
                            </v-flex>
                            <v-flex style="margin-top: 40px;">
                                <v-slider v-model="slider" :value="slider" label="Zoom" max="20" @change="slideZoom()"></v-slider>
                                <div class="text-xs-center">
                                    <v-chip label outline color="#5ac4bb">{{slider}}</v-chip>
                                </div>
                            </v-flex>
                        </v-container>
                    </v-card>
                </v-expansion-panel-content>
                <!--End location menu-->

                <!--Style menu-->
                <v-expansion-panel-content>
                    <div slot="header" class="item">Customize</div>
                    <v-card>
                        <v-container grid-list-md>
                            <v-layout>

                                <v-flex xs6 sm6>
                                    <v-tooltip top>
                                        <v-avatar class="rotating" :size="100" color="grey lighten-4" slot="activator" @click="streetStyle()">
                                            <img src="../assets/street.png" alt="street">
                            </v-avatar>
                                            <span>Street</span>
                                    </v-tooltip>
                                </v-flex>

                                <v-flex xs6 sm6>
                                    <v-tooltip top>
                                        <v-avatar class="rotating" :size="100" color="grey lighten-4" slot="activator" @click="nightStyle()">
                                            <img src="../assets/night.png" alt="night">
                            </v-avatar>
                                            <span>Night</span>
                                    </v-tooltip>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex xs6 sm6>
                                    <v-tooltip top>
                                        <v-avatar class="rotating" :size="100" color="grey lighten-4" slot="activator" @click="darkStyle()">
                                            <img src="../assets/dark.png" alt="dark">
                            </v-avatar>
                                            <span>Dark</span>
                                    </v-tooltip>
                                </v-flex>

                                <v-flex xs6 sm6>
                                    <v-tooltip top>
                                        <v-avatar class="rotating" :size="100" color="grey lighten-4" slot="activator" @click="basicStyle()">
                                            <img src="../assets/basic.png" alt="basic">
                            </v-avatar>
                                            <span>Basic</span>
                                    </v-tooltip>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex xs6 sm6>
                                    <v-tooltip top>
                                        <v-avatar class="rotating" :size="100" color="grey lighten-4" slot="activator" @click="brightStyle()">
                                            <img src="../assets/bright.png" alt="bright" id="bright">
                            </v-avatar>
                                            <span>Bright</span>
                                    </v-tooltip>
                                </v-flex>
                                <v-flex xs6 sm6>
                                    <v-tooltip top>
                                        <v-avatar class="rotating" :size="100" color="grey lighten-4" slot="activator" @click="satelliteStyle()">
                                            <img src="../assets/satellite.png" alt="satellite">
                            </v-avatar>
                                            <span>Satellite</span>
                                    </v-tooltip>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-expansion-panel-content>
                <!--End style menu-->

                <!--Size menu-->
                <!-- <v-expansion-panel-content>
                    <div slot="header" class="item">Size</div>
                    <v-card>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-text-field label="Height" v-model="height"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="Width" v-model="width"></v-text-field>
                                </v-flex>
                                <v-btn light color="primary" @click="retour()">Apply</v-btn>
                            </v-layout>
                            <v-flex style="margin-top: 40px;">
                                <v-slider v-model="slider" label="Zoom" max="20" @change="slideZoom()"></v-slider>
                                <div class="text-xs-center">
                                    <v-chip label outline color="#5ac4bb">{{slider}}</v-chip>
                                </div>
                            </v-flex>
                        </v-container>
                    </v-card>
                </v-expansion-panel-content> -->
                <!--End size menu-->

                <!--Markers menu-->
                <v-expansion-panel-content v-model="place">
                    <div slot="header" class="item">Add places</div>
                    <v-card>
                        <v-container grid-list-md>
                            <v-flex xs12 sm12>
                                <v-btn @click="markerFormDialog = true" @click.native="deleteItem()">Add new place</v-btn>
                            </v-flex>
                            <v-flex xs12 sm12>
                                <v-card v-drag-and-drop:options="options" class="drag-wrapper">
                                    <v-list dense id="liste"></v-list>
                                </v-card>
                            </v-flex>
                        </v-container>
                    </v-card>
                </v-expansion-panel-content>
                <!--End markers menu-->

                <!--File content menu-->
                <v-expansion-panel-content v-model="panelFillContent">
                    <div slot="header" class="item">Fill content</div>
                    <v-card class="fill-content">
                        <v-container grid-list-md>
                            <v-flex xs12 sm12>
                                <v-card-text>
                                    <p>
                                       Click to add text
                                    </p>
                                    <v-divider></v-divider>
                                    <div class="fill-content-exemple" contenteditable="false">
                                        <h1 @click="clone()" class="addHeading">Add heading</h1>
                                    </div>
                                    <v-divider></v-divider>
                                    <v-flex xs12>
                                        <p>Upload an image</p>
                                        <b-alert :show="alertImageErrorFlyer1" dismissible variant="danger">Upload a valid image file</b-alert>
                                        <input type="file" id="fileFlyer1" accept="image/*" @change="onImageMapFlyerChange($event.target.files)">
                                        <!-- <label for="file">Upload an image</label> -->
                                        <!-- <v-img class="img-flyer" id="img-flyer" :src="imageFlyer" aspect-ratio="1"></v-img> -->
                                    </v-flex>
                                </v-card-text>
                            </v-flex>
                        </v-container>
                    </v-card>
                </v-expansion-panel-content>
                <!--End file content menu-->

                <!--Order menu-->
                <v-expansion-panel-content>
                    <div slot="header" class="item">Order</div>
                    <v-card>
                        <v-container grid-list-md>
                            <v-flex xs12 sm12>
                                <v-btn class="btn-download" @click="printForm = !printForm">Download</v-btn>
                            </v-flex>
                        </v-container>
                    </v-card>
                </v-expansion-panel-content>
                <!--End order menu-->
            </v-expansion-panel>
            <!-- <img :src="image">  -->
        </v-list>
        <div id="test"></div>
    </v-navigation-drawer>
    <!--End navigation drawer for menu-->

    <!--List of markers-->
    <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app class="navigation marker-navigation" v-show="markerDrawer == false">
        <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" light app fixed>
            <v-toolbar-title>
                <span>Markers</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip top>
                <v-btn slot="activator" class="newMarker" @click="markerFormDialog = true">New</v-btn>
                <span>New marker</span>
            </v-tooltip>
            <v-tooltip top>
                <v-icon slot="activator" class="arrow" @click="markerDrawer = true, panel = false">arrow_back</v-icon>
                <span>Back</span>
            </v-tooltip>
        </v-toolbar>
        <v-list dense id="liste"></v-list>
    </v-navigation-drawer>
    <!--End list of markers-->

    <!--Content-->
    <v-content>
        <v-container fluid fill-height justify-center>
            <v-flex>
                <v-card :height="hauteur" :width="longueur" v-show="switchMap" style="margin: 0 auto">
                    <!--Map container-->
                    <v-flex xs12 sm12>
                        <v-card :height="hauteur" :width="longueur" style="margin: 0 auto" id="map">
                        </v-card>
                    </v-flex>
                    <!--End map container-->
                </v-card>
                <!--Flyer-->
                <v-card :height="hauteurFlyer" :width="longueurFlyer" v-show="switchFlyer" id="flyer" style="margin: 0 auto">
                    <v-container fluid grid-list-md>
                        <vue-cloneya :minimum="1" :multiple="true">
                            <div class="stylize" id="stylize">
                                <vue-draggable-resizable :draggable="true" dragCancel=".adh" :resizable="true" :parent="false" :maximize="true" :active="true" :w="300" :h="100" class="drag" id="drag">
                                    <h1 id="adh" class="adh" contenteditable="true">Add heading</h1>
                                </vue-draggable-resizable>
                                <!--<vue-drag-resize contenteditable="true" :isActive="true" :w="200" :h="50" :isDraggable="true" :isResizable="true" v-on:resizing="resizeDrag" v-on:dragging="resizeDrag">
                                    <h1>Add heading</h1>
                                </vue-drag-resize>-->
                                <v-btn id="clone" class="clone" v-cloneya-add></v-btn>
                            </div>
                        </vue-cloneya>
                        <v-layout row wrap class="layoutFlyer" style="display: none">
                            <!--<v-flex d-flex xs12 sm6 md3>
                                <v-card class="card-flyer file-content">
                                    <v-card-title primary class="title">FILE CONTENT</v-card-title>
                                    <v-card-text>
                                        <p>
                                            Pour éditer un contenu, il vous suffit de cliquer dessus et de sélectionner l'élément à modifier.
                                        </p>
                                        <p>
                                            Vous pouvez également rajouter d'autres éléments:
                                        </p>
                                        <v-divider></v-divider>
                                        <quill-editor class="editor-example bubble editor_first" ref="myTextEditor" :content="content" :options="editorOption" @change="onEditorChange($event)">
                                        </quill-editor>
                                        <v-divider></v-divider>
                                        <v-flex xs12>
                                            <b-alert :show="alertImageErrorFlyer1" dismissible variant="danger">Upload a valid image file</b-alert>
                                            <input type="file" id="fileFlyer1" accept="image/*" @change="onImageFlyerChange($event.target.files)">
                                            <label for="file">Upload an image</label>
                                            <v-img class="img-flyer" id="img-flyer" :src="imageFlyer" aspect-ratio="1"></v-img>
                                        </v-flex>
                                    </v-card-text>
                                </v-card>
                            </v-flex> -->
                            <v-flex d-flex xs12 sm6 md4>
                                <v-card class="card-flyer">
                                    <v-layout row wrap>
                                        <v-card-text>
                                            <quill-editor class="editor-example bubble toolbar" id="editor1" ref="myTextEditor1" :content="content1" :options="editorOption" @change="onEditor1Change($event)">
                                            </quill-editor>
                                        </v-card-text>
                                        <v-flex xs12 sm12>
                                            <v-card height="200px" width="90%" style="margin: 0 auto; display: none" id="mapFlyer">
                                            </v-card>
                                            <b-alert :show="alertImageErrorFlyer2" dismissible variant="danger">Upload a valid image file</b-alert>
                                            <!-- <input type="file" id="fileFlyer2" accept="image/*" class="img-main" @change="onImageMapFlyerChange($event.target.files)"> -->
                                            <!-- <label for="file">Upload an image</label> -->
                                            <v-img height="200px" width="90%" style="margin: 0 auto" :src="imageMapFlyer" aspect-ratio="1"></v-img>
                                        </v-flex>
                                        <v-card-text>
                                            <quill-editor class="editor-example bubble toolbar" ref="myTextEditor2" :content="content2" :options="editorOption" @change="onEditor2Change($event)">
                                            </quill-editor>
                                        </v-card-text>
                                    </v-layout>
                                </v-card>
                            </v-flex>
                            <v-flex d-flex xs12 sm6 md4 child-flex>
                                <v-card class="card-flyer card-list-marker test">
                                    <v-layout row wrap>
                                        <v-card-text>
                                            <quill-editor class="editor-example bubble" ref="myTextEditor3" :content="content3" :options="editorOption" @change="onEditor3Change($event)">
                                            </quill-editor>
                                            <v-card contenteditable="false" id="flyerMarker" v-drag-and-drop:options="options" class="drag-wrapper">

                                            </v-card>
                                        </v-card-text>

                                    </v-layout>
                                </v-card>
                            </v-flex>
                            <v-flex d-flex xs12 sm6 md4>
                                <v-card v-drag-and-drop:options="options" class="drag-wrapper card-flyer">
                                    <v-layout row wrap>
                                        <v-card-text>
                                            <quill-editor class="editor-example bubble" ref="myTextEditor4" :content="content4" :options="editorOption" @change="onEditor4Change($event)">
                                            </quill-editor>
                                            <ul contenteditable="false" id="ulflyerMarker">
                                                <li id="listeflyerMarker"></li>
                                            </ul>
                                        </v-card-text>

                                    </v-layout>
                                </v-card>

                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
                <!--End flyer-->

            </v-flex>
        </v-container>
    </v-content>
    <!--End content-->

    <!--Print button-->
    <!-- <v-tooltip top>
        <v-btn fab slot="activator" bottom right color="pink" dark fixed @click="printForm = !printForm" style="margin-bottom: 50px" id="icon-full">
            <v-icon>print</v-icon>
        </v-btn>
        <span>Print</span>
    </v-tooltip> -->
    <!--End print button-->
    <!--Switch button-->
    <v-tooltip top>
        <v-btn fab slot="activator" light fixed bottom right class="switchBtn" @click="switchMap = !switchMap, switchFlyer = !switchFlyer" @click.native="mapFlyer()">
            <v-icon>repeat</v-icon>
        </v-btn>
        <span v-if="switchMap">Switch to flyer</span>
        <span v-else>Switch to map</span>
    </v-tooltip>
    <!--End switch button-->
    <!--Modal print form-->
    <v-dialog v-model="printForm" width="500">
        <v-card class="sign" light>
            <v-card-title class="title">
                Print
            </v-card-title>

            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field label="Name" id="namePrint" required></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12>
                            <v-select :items="formatPrint" label="Format" id="formatPrint" v-model="select" :hint="`${select.type}, ${select.abbr}`" item-text="type" item-value="abbr" persistent-hint return-object single-line required></v-select>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>

            <spin v-show="spinner"></spin>
            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" flat @click.native="printForm = false , spinner = false" @click="stateExportBtn(false)">Cancel</v-btn>
                <v-btn color="#5ac4bb" id="exportPDF" flat @click="customPrint()">Export</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <!--End modal print form-->

    <!-- Modal add marker-->
    <!--<v-dialog v-model="markerFormDialog" width="500">
            <v-card class="sign" light>
            <v-card-title
                class="title"
            >
                Add places
            </v-card-title>

            <v-card-text>
                <v-container grid-list-md>
                <v-layout wrap>
                    <v-flex xs12>
                        <div id="geocoderPlace"></div>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field label="Name" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field label="Adress" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field label="Complement" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row wrap>
                            <v-text-field label="Code postal" required style="width: 60px"></v-text-field>
                            <v-text-field label="City" required style="margin-left: 5px"></v-text-field>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row wrap>
                            <v-text-field label="Tel." required style="width: 100px"></v-text-field>
                            <v-text-field label="Email" required style="margin-left: 5px"></v-text-field>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field label="Website" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-textarea
                            outline
                            value="If you want to add a comment to your clients about this place"
                        ></v-textarea>
                    </v-flex>
                </v-layout>
                </v-container>
            </v-card-text>
            
            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" flat @click.native="markerFormDialog = false">Cancel</v-btn>
                <v-btn color="#5ac4bb" flat>Save</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>-->
    <!--End modal marker-->

    <!-- Modal add marker popup-->
    <v-dialog v-model="markerFormDialog" width="500">
        <v-card class="sign" light>
            <v-form v-model="valid" ref="form">
                <v-card-title class="title">
                    Add markers
                </v-card-title>

                <v-card-text>

                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 class="markerName">
                                <v-text-field label="Name" :rules="nameRules" :counter="20" required id="markerName" :value="nameValue"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <!-- <v-text-field label="Description" required id="popupmsg"></v-text-field> -->
                                <v-textarea outline label="Description" :rules="descriptionRules" required id="popupmsg" :value="descriptionValue"></v-textarea>
                            </v-flex>
                            <!-- <v-flex id="grid-file" xs12>
                            <b-alert :show="alertImageError" dismissible variant="danger">Upload a valid image file {{dismissCountDown}}</b-alert>
                            <input type="file"
                                      ref="file"
                                      id="file"
                                      accept="image/*"
                                      @change="onImageFileChange($event.target.files)"
                              >
                            <label for="file">Upload an image</label> 
                        </v-flex> -->
                        </v-layout>
                    </v-container>
                    <v-container grid-list-md>
                        <v-flex xs12 sm6 class="py-6 icon">
                            <p>Icon</p>
                            <v-btn-toggle v-model="toggle_exclusive">
                                <v-btn id="pin1" flat @click="changePin(1)">
                                    <v-icon class="btn-pin"></v-icon>
                                </v-btn>
                                <v-btn id="pin2" flat @click="changePin(2)">
                                    <v-icon class="btn-pin"></v-icon>
                                </v-btn>
                                <v-btn id="pin3" flat @click="changePin(3)">
                                    <v-icon class="btn-pin"></v-icon>
                                </v-btn>
                                <v-btn id="pin4" flat @click="changePin(4)">
                                    <v-icon class="btn-pin"></v-icon>
                                </v-btn>
                                <v-btn id="pin5" flat @click="changePin(5)">
                                    <v-icon class="btn-pin"></v-icon>
                                </v-btn>
                            </v-btn-toggle>
                        </v-flex>
                        <!-- <colorpicker :color="defaultColor" v-model="defaultColor"/>   -->
                        <!-- </v-flex> -->
                    </v-container>
                    <b-alert :show="alertCoordinatesError" dismissible variant="danger">Add a coordinates</b-alert>
                    <v-container id="grid-coordinates" grid-list-md v-if="testMarkerListeToggle == true">
                        <v-flex xs12 sm12>
                            <v-text-field label="Longitude" type="number" :rules="coordinatesRules" id="markerLong" :value="longitudeValue"></v-text-field><br>
                            <v-text-field label="Latitude" type="number" :rules="coordinatesRules" id="markerLat" :value="latitudeValue"></v-text-field><br>
                            <div id="geocoderPlace" style="display: none"></div>
                            <!--<v-btn light color="primary" @click="coordinatesAddMarker()">Apply</v-btn>-->
                        </v-flex>
                    </v-container>
                    <v-container id="grid-coordinates" grid-list-md v-else>
                        <v-flex xs12 sm12>
                            <div id="place"></div>
                        </v-flex>
                    </v-container>
                    <v-container grid-list-md>
                        <!--<v-btn light color="primary" @click="allMarker()">All markers</v-btn><br><br>-->
                        <span class="" v-if="testMarkerListeToggle == true"><a href="#" @click="markerFormFalse()">From a search</a></span>
                        <span class="" v-else><a href="#" @click="markerFormTrue()">From the coordinates</a></span>
                    </v-container>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click.native="markerFormDialog = false" @click="cancelMarker()">Cancel</v-btn>
                    <v-btn color="#5ac4bb" id="saveMarker" flat @click="saveMarker()">Save</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
    <!--End modal marker popup-->

    <!-- Modal update marker popup-->
    <v-dialog v-model="markerUpdateFormDialog" width="500">
        <v-card class="sign" light>
            <v-form v-model="valid" ref="formUpdate">
                <v-card-title class="title">
                    Update markers
                </v-card-title>

                <v-card-text>

                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 class="markerName">
                                <v-text-field label="Name" :rules="nameRules" :counter="20" required :value="nameValue" id="nameMarkerUpdate"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <!-- <v-text-field label="Description" required id="popupmsg"></v-text-field> -->
                                <v-textarea outline label="Description" :rules="descriptionRules" required :value="descriptionValue" id="descriptionMarkerUpdate"></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <v-container grid-list-md>
                        <v-flex xs12 sm6 class="py-6 icon">
                            <p>Icon</p>
                            <v-btn-toggle v-model="toggle_exclusive">
                                <v-btn id="clonepin1" flat @click="changePin(1)">
                                    <v-icon class="btn-pin"></v-icon>
                                </v-btn>
                                <v-btn id="clonepin2" flat @click="changePin(2)">
                                    <v-icon class="btn-pin"></v-icon>
                                </v-btn>
                                <v-btn id="clonepin3" flat @click="changePin(3)">
                                    <v-icon class="btn-pin"></v-icon>
                                </v-btn>
                                <v-btn id="clonepin4" flat @click="changePin(4)">
                                    <v-icon class="btn-pin"></v-icon>
                                </v-btn>
                                <v-btn id="clonepin5" flat @click="changePin(5)">
                                    <v-icon class="btn-pin"></v-icon>
                                </v-btn>
                            </v-btn-toggle>
                        </v-flex>
                        <!-- <colorpicker :color="defaultColor" v-model="defaultColor"/>   -->
                        <!-- </v-flex> -->
                    </v-container>
                    <v-container id="grid-coordinates" grid-list-md v-if="testMarkerListeToggle == true">
                        <v-flex xs12 sm12>
                            <v-text-field label="Longitude" type="number" id="longitudeMarkerUpdate" :rules="coordinatesRules" :value="longitudeValue"></v-text-field><br>
                            <v-text-field label="Latitude" type="number" id="latitudeMarkerUpdate" :rules="coordinatesRules" :value="latitudeValue"></v-text-field><br>
                            <div id="geocoderPlace" style="display: none"></div>
                            <!--<v-btn light color="primary" @click="coordinatesAddMarker()">Apply</v-btn>-->
                        </v-flex>
                    </v-container>
                    <v-container id="grid-coordinates" grid-list-md v-else>
                        <v-flex xs12 sm12>
                            <div id="updateplace"></div>
                        </v-flex>
                    </v-container>
                    <v-container grid-list-md>
                        <!--<v-btn light color="primary" @click="allMarker()">All markers</v-btn><br><br>-->
                        <span class="" v-if="testMarkerListeToggle == true"><a href="#" @click="markerFormFalse()">From a search</a></span>
                        <span class="" v-else><a href="#" @click="markerFormTrue()">From the coordinates</a></span>
                    </v-container>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click.native="markerUpdateFormDialog = false" @click="cancelMarker()">Cancel</v-btn>
                    <v-btn color="#5ac4bb" id="updateMarker" flat @click="updateMarker()">Update</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
    <!--End update modal marker popup-->

    <!--Footer-->
    <v-footer height="auto" light class="pa-3">
        <v-flex row wrap class="text-xs-center d-flex align-center">
            <v-tooltip top>
                <v-btn fab slot="activator" light fixed bottom left v-model="drawer" @click.stop="drawer = !drawer" class="btnTooltip full" id="btnToolFull" @click="rideau()">
                    <v-icon v-if="drawer" class="icon-full" id="icon-full">fullscreen</v-icon>
                    <v-icon id="icon-full_exit" v-else>fullscreen_exit</v-icon>
                </v-btn>
                <span v-if="drawer">Fullscreen</span>
                <span v-else>Exit fullscreen</span>
            </v-tooltip>
        </v-flex>
        <v-spacer></v-spacer>
        <span id="visible" style="visibility: hidden">{{defaultColor}}</span>
        <div id="copy">&copy; {{ fullYear }}</div>
    </v-footer>
    <!--End footer-->
    <!-- Preloader -->
    <div id="preloader">
        <div class="preloader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
    <!-- /Preloader -->
</v-app>
</template>

<script src="../assets-bundler/javascripts/map.js"></script>

<style src="../assets-bundler/styles/map.scss"></style>
