/*Map*/
import Spin from '../../components/Spin.vue'

export default {
    components: {
        Spin
    },
    data() {
        return {
            accessToken: 'pk.eyJ1IjoiYXJhZGltaXNvbiIsImEiOiJjamwzY2F5bGExdTAyM3ZvZGw0YWM4MXMzIn0.x-OlbsTxKnwonoGNOlgMYw',
            styleDark: 'mapbox://styles/aradimison/cjna2lkvl4msh2sp4o22vd21m',
            styleNight: 'mapbox://styles/aradimison/cjm8vrk716bnn2rjlv9xba3h1',
            styleStreet: 'mapbox://styles/aradimison/cjna2houh3x4l2sk739b4pers',
            styleBright: 'mapbox://styles/aradimison/cjna2rn364mu52smkgslfc0tt',
            styleBasic: 'mapbox://styles/aradimison/cjl3hr5tq818b2soaia7maj2j',
            styleSatellite: 'mapbox://styles/mapbox/satellite-v9',
            height: '400px',
            width: '800px',
            hauteur: '400px',
            longueur: '800px',
            hauteurFlyer: '600px',
            longueurFlyer: '1000px',
            dialog: false,
            testMarkerListeToggle: false,
            spinner: false,
            drawer: null,
            markerDrawer: null,
            map: null,
            mapFlyers: null,
            markerGeocoder: null,
            geocoder: null,
            slider: 5,
            pincolor: '008000',
            defaultColor: "#ff0000",
            geojson: {
                type: "FeatureCollection",
                features: [],
            },
            image: '',
            imageFlyer: '',
            imageMapFlyer: '',
            printForm: false,
            select: { type: '', abbr: '' },
            formatPrint: [
                { type: 'A1', abbr: 'a1' },
                { type: 'A2', abbr: 'a2' },
                { type: 'A3', abbr: 'a3' },
                { type: 'A4', abbr: 'a4' }
            ],
            text: 'center',
            icon: 'justify',
            toggle_none: null,
            toggle_one: 0,
            toggle_exclusive: 2,
            coordinatesCity: [],
            markerFormDialog: false,
            panel: null,
            panelFillContent: null,
            switchMap: true,
            switchFlyer: false,
            options: {
                showDropzoneAreas: true,
                multipleDropzonesItemsDraggingEnabled: true
            },
            mapLocation: null,
            content: `
                <div contenteditable="false">
                    <h1>Ajouter un titre</h1>
                    <h2>Ajouter un sous-titre</h2>
                    <p>Ajouter un texte</p>
                </div>
            `,
            content1: `
                <div contenteditable="true">
                    <h1>Ajouter un titre</h1>
                    <h2>Ajouter un sous-titre</h2>
                    <p>Ajouter un texte</p>
                </div>
            `,
            content2: `
                <div contenteditable="true">
                    <h1>Ajouter un titre</h1>
                    <h2>Ajouter un sous-titre</h2>
                    <p>Ajouter un texte</p>
                </div>
            `,
            content3: `
                <div contenteditable="true">
                    <h2>Ajouter un sous-titre</h2>
                </div>
            `,
            content4: `
                <div contenteditable="true">
                    <h2>Ajouter un sous-titre</h2>
                </div>
            `,
            editorOption: {
                theme: 'bubble',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'font': [] }],
                        [{ 'align': [] }],
                        ['link', 'image'],
                        ['clean']
                    ]
                }
            },
            listeNameMarker: [],
            alertImageError: false,
            alertImageErrorFlyer1: false,
            alertImageErrorFlyer2: false,
            valid: false,
            nameRules: [
                (v) => !!v || 'Name is required',
                (v) => v && v.length <= 20 || 'Name must be less than 20 characters'
            ],
            coordinatesRules: [
                (v) => !!v || 'Coordinates or place is required'
            ],
            descriptionRules: [
                (v) => !!v || 'Description is required'
            ],
            latitudeValue: null,
            longitudeValue: null,
            nameValue: null,
            descriptionValue: null,
            markerUpdateFormDialog: false,
            zoomv: null,
            place: null,
            widthDrag: 0,
            heightDrag: 0,
            topDrag: 0,
            leftDrag: 0,
            alertCoordinatesError: false,
        }
    },
    watch: {
        /**
         * Open marker menu and update list marker
         * @method panel
         */
        panel() {
            if (this.panel == true) {
                this.allMarker();
            } else {
                this.markerDrawer = true
            }
        },

        /**
         * Open fill content menu to switch flyer and resize the map
         * @method panelFillContent
         */
        panelFillContent() {
            if (this.panelFillContent == true) {
                this.switchFlyer = true;
                this.switchMap = false;
                this.clearFlyerMarkerList();
                this.flyerListMarker();
            } else {
                this.switchFlyer = false;
                this.switchMap = true;
                setTimeout(() => {
                    this.map.resize();
                }, 1000)
            }
        },

        place() {
            this.clearMarkerList();
            this.listAllMarker();
        },

        markerFormDialog() {
            this.$refs.form.reset()
        },
    },
    computed: {
        /**
         * Get current year
         * @method fullYear
         */
        fullYear() {
            return new Date().getFullYear()
        },
        editor() {
            return this.$refs.myTextEditor.quill && this.$refs.myTextEditor1.quill && this.$refs.myTextEditor2.quill && this.$refs.myTextEditor3.quill && this.$refs.myTextEditor4
        }
    },
    mounted() {
        this.preloader();
        this.getZoomValue();
        this.clearLog();
        this.initMap();
        this.setAttr();
        this.listAllMarker();
        this.geojson = this.jsonToGeojson();
        this.flyerListMarker();
        this.mapFlyer();
        //this.clone()
    },
    methods: {
        setAttr() {
            var input = document.getElementById('place').getElementsByTagName('input');
            input[0].setAttribute('required', '');
            console.log(input[0].attributes)
        },
        deleteItem() {
            var temp = JSON.parse(localStorage.getItem('nameMarker'));
            if (temp != null) {
                if (temp.length == 0) {
                    localStorage.removeItem('nameMarker')
                }
            }
        },

        /**
         * Synchronize zoom control with slider
         * @method getZoomValue
         */
        getZoomValue() {
            if (this.$store.state.zoom == null) {
                this.slider = 5;
            } else {
                this.slider = this.$store.state.zoom;
            }
        },
        /** Attach zoom control to slider */
        slideZoom() {
            this.map.setZoom(this.slider);
            localStorage.setItem('zoom', JSON.stringify(this.slider));
        },
        /** Show search with location on the markers menu */
        markerFormTrue() {
            return this.testMarkerListeToggle = true;
        },
        /** Show search with coordinates on the markers menu */
        markerFormFalse() {
            return this.testMarkerListeToggle = false;
        },
        /** Set map height */
        setHeight() {
            return this.hauteur = this.height;
        },
        /** Set map width */
        setWidth() {
            return this.longueur = this.width;
        },
        /**
         * Resize the map canvas
         * @method setSize
         * @return {height, width, redefinir}
         */
        setSize() {
            var heightMap = this.setHeight();
            var widthMap = this.setWidth();
            var redefinirDimensionMap = this.setResize(heightMap, widthMap);
            return {
                heightMap,
                widthMap,
                redefinirDimensionMap
            }
        },
        setResize(height, width) {
            var mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
            var heightCanvas = mapCanvas.style.height = height;
            var widthCanvas = mapCanvas.style.width = width;
            return {
                heightCanvas,
                widthCanvas
            }
        },

        /**
         * Update the map after resize
         * @method retour
         * @return {Promise}
         */
        retour() {
            return new Promise((resolve, reject) => {
                if (this.setSize()) {
                    setTimeout(() => {
                        resolve(this.map.resize())
                    }, 250)
                } else {
                    reject('error')
                }
            })
        },
        /**
         * Menu toggle
         * @method rideau
         * @return {void}
         */
        rideau() {
            if (window.matchMedia("(max-width: 1300px)").matches) {

            } else {
                if (this.drawer) {
                    document.getElementById('btnToolFull').style.marginLeft = '300px';
                } else {
                    document.getElementById('btnToolFull').style.marginLeft = '0px';
                    this.markerDrawer = true;
                }
            }
        },
        /**
         * Initialize the map
         * @method initMap
         * @return {void}
         */
        initMap() {

            /** Mapbox access token */
            mapboxgl.accessToken = this.accessToken;

            if (this.$store.state.mapLocation == null) {
                this.$store.state.mapLocation = [2.321, 48.859]
            }
            if (this.$store.state.zoom == null) {
                this.$store.state.zoom = 5
            }
            /** Draw map */
            this.map = new mapboxgl.Map({
                container: 'map',
                style: this.styleBright,
                center: this.$store.state.mapLocation,
                zoom: this.$store.state.zoom
            });

            // disable map zoom when using scroll
            this.map.scrollZoom.disable();

            // On zoom control click => Change slider value  
            this.map.on('zoom', () => {
                this.slider = this.map.getZoom();
                localStorage.setItem('zoom', JSON.stringify(this.slider));
            });

            this.clearLog();
            this.jsonToGeojson().features.forEach(marker => {
                // When a click event occurs on a feature in the markers layer, open a popup at the
                // location of the feature, with description HTML from its properties
                this.map.on('click', marker.properties.name, e => {
                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to
                    while (Math.abs(e.lngLat.lng - marker.geometry.coordinates[0]) > 180) {
                        marker.geometry.coordinates[0] += e.lngLat.lng > marker.geometry.coordinates[0] ? 360 : -360;
                    }

                    this.testMarkerListeToggle = true;
                    this.markerUpdateFormDialog = true;
                    this.latitudeValue = marker.geometry.coordinates[1];
                    this.longitudeValue = marker.geometry.coordinates[0];
                    this.nameValue = marker.properties.name;
                    this.descriptionValue = marker.properties.popup;
                    this.$store.state.idMarker = marker.properties.numero;
                    this.$store.state.pinType = marker.properties.pin;
                    console.log(marker.properties.id)
                })

                // Change the cursor to a pointer when the mouse is over the markers layer
                this.map.on('mouseenter', marker.properties.name, () => {
                    this.map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to a pointer when it leaves.
                this.map.on('mouseleave', marker.properties.name, () => {
                    this.map.getCanvas().style.cursor = '';
                });

                var value = marker;
                this.mapLayer(marker, value, 2000);

            });

            /** Full screen control */
            this.map.addControl(new mapboxgl.FullscreenControl());

            /** Create a geocoder for location */
            this.geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                placeholder: 'Search a location',
            });
            document.getElementById('geocoder').appendChild(this.geocoder.onAdd(this.map))

            /** On geocoder result */
            this.geocoder.on('result', ev => {
                this.$store.state.mapLocation = ev.result.geometry.coordinates;
                localStorage.setItem('location', JSON.stringify(ev.result.geometry.coordinates))
            })

            /*var place = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                placeholder: 'Search a location'
            });
            document.getElementById('place').appendChild(place.onAdd(this.map))*/

            /** create a marker geocoder control */
            this.markerGeocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                placeholder: 'Search a location to mark',
                flyTo: false
            });
            document.getElementById('place').appendChild(this.markerGeocoder.onAdd(this.map))

            this.updateMarkerGeocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                placeholder: 'Search a location to mark',
                flyTo: false
            });
            document.getElementById('updateplace').appendChild(this.updateMarkerGeocoder.onAdd(this.map))


            /** Marker geocoder on result */
            this.markerGeocoder.on('result', ev => {
                this.$store.state.coordinates = ev.result.geometry.coordinates;
            });

            /** Update marker geocoder on result */
            this.updateMarkerGeocoder.on('result', ev => {
                this.$store.state.coordinates = ev.result.geometry.coordinates;
            });

            /** User location control */
            this.map.addControl(new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            }));

            // Add zoom and rotation controls to the map.
            //this.map.addControl(new mapboxgl.NavigationControl());
            var nav = new mapboxgl.NavigationControl({
                showCompass: false,
                showZoom: true
            });
            this.map.addControl(nav, "top-left");
        },

        /**
         * Cancel adding a marker
         * 
         * @method cancelMarker
         */
        cancelMarker() {
            /*var supprimer = document.getElementById('markerName').value;
            if (supprimer != '') {
                //var keys = Object.keys(localStorage);
                var keys = JSON.parse(localStorage.getItem('nameMarker'));
                if (keys != null) {
                    for (var i = 0; i < keys.length; i++) {
                        var value = JSON.parse(localStorage.getItem(keys[i]))
                        console.log('VALUE', value)
                        if (value.name == supprimer) {
                            localStorage.removeItem(supprimer);
                            this.map.removeLayer(supprimer);
                            var aSupprimer = localStorage.getItem('nameMarker')
                            var tab = JSON.parse(aSupprimer);
                            var index = tab.indexOf(value.idMarker + value.name);
                            if (index > -1) {
                                tab.splice(index, 1);
                            }
                            localStorage.setItem('nameMarker', JSON.stringify(tab));
                            localStorage.removeItem('loglevel:webpack-dev-server');
                            this.clearMarkerList();
                            this.listAllMarker();
                            break;
                        } else {

                        }
                    }
                }
            }*/
            this.$refs.form.reset();
            document.getElementById('place').getElementsByTagName('input').value = '';
        },

        /**
         * Save marker to storage
         * @method saveMarker
         */
        saveMarker() {
            var coordinates = document.getElementById('place').getElementsByTagName('input');
            if (document.getElementById('markerName').value != '' && document.getElementById('popupmsg').value != '' && coordinates[0].value != '') {
                if (document.getElementById('markerLat') && document.getElementById('markerLong')) {
                    this.coordinatesAddMarker();
                } else {
                    var customPopup = document.getElementById('popupmsg').value;
                    //var keys = Object.keys(localStorage);
                    var keys = JSON.parse(localStorage.getItem('nameMarker'));
                    var id = this.compteID() + 1;
                    var idMarker = null;
                    var marker = {};
                    if (keys != null) {
                        for (var i = 0; i < keys.length; i++) {
                            var val = JSON.parse(localStorage.getItem(keys[i]));
                            if (val.idMarker == id) {
                                idMarker = id + 1;
                                marker = {
                                    idMarker: idMarker.toString(),
                                    popup: customPopup,
                                    name: document.getElementById('markerName').value,
                                    emp: this.$store.state.coordinates,
                                    pin: this.$store.state.pinType,
                                    key: document.getElementById('markerName').value
                                }
                            } else {
                                idMarker = id;
                                marker = {
                                    idMarker: idMarker.toString(),
                                    popup: customPopup,
                                    name: document.getElementById('markerName').value,
                                    emp: this.$store.state.coordinates,
                                    pin: this.$store.state.pinType,
                                    key: document.getElementById('markerName').value
                                }
                            }
                        }
                    } else {
                        idMarker = id;
                        marker = {
                            idMarker: idMarker.toString(),
                            popup: customPopup,
                            name: document.getElementById('markerName').value,
                            emp: this.$store.state.coordinates,
                            pin: this.$store.state.pinType,
                            key: document.getElementById('markerName').value
                        }

                    }
                    if (idMarker != null) {
                        this.storeMarker(marker);
                        this.addMarker(marker, this.$store.state.pinType);
                        this.clearMarkerList();
                        this.listAllMarker();
                    }

                }
                this.$refs.form.reset();
                coordinates[0].value = '';
                this.markerFormDialog = false;
            } else {
                this.$refs.form.validate();
                this.alertCoordinatesError = true;
            }
        },

        /**
         * Change pin icon
         * @param {Number} idBouton -Pin login  
         * @method changePin
         */
        changePin(idBouton) {
            if (idBouton == 1) {
                this.$store.state.pinType = 'red_pin';
            } else if (idBouton == 2) {
                this.$store.state.pinType = 'blue_pin';
            } else if (idBouton == 3) {
                this.$store.state.pinType = 'yellow_pin';
            } else if (idBouton == 4) {
                this.$store.state.pinType = 'green_pin';
            } else {
                this.$store.state.pinType = 'violet_pin';
            }
        },

        /**
         * Set map marker layer
         * 
         * @param {Array} marker - Marker propreties   
         * @param {String} icon - URL of icon image for the marker
         * @param {Number} time - Time for time out to load map style
         * @method mapLayer 
         */
        mapLayer(marker, icon, time) {
            var TIMEOUT = 100;
            var maxWait = 10000;
            var waited = -1 * TIMEOUT;

            return new Promise((resolve, reject) => {
                var checkStyle = () => {
                    if (this.map.isStyleLoaded()) {
                        resolve(
                            setTimeout(() => {
                                this.map.addLayer({
                                    'id': marker.properties.name,
                                    'type': 'symbol',
                                    'source': {
                                        'type': 'geojson',
                                        'data': {
                                            'type': 'FeatureCollection',
                                            'features': [{
                                                'type': 'Feature',
                                                'geometry': {
                                                    'type': 'Point',
                                                    'coordinates': marker.geometry.coordinates
                                                }
                                            }]
                                        }
                                    },
                                    'layout': {
                                        "icon-image": marker.properties.pin,
                                        "icon-size": 0.2,
                                        "icon-allow-overlap": true,
                                        "icon-ignore-placement": true,
                                        "text-field": marker.properties.numero,
                                        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                                        "text-size": 15,
                                        "text-offset": [-0.1, -0.2],
                                        "text-anchor": "center"
                                    },
                                    "paint": {
                                        "text-color": "#fff",
                                        "icon-color": "#fff"
                                    },
                                });
                            }, time)
                        );
                    } else {
                        waited += TIMEOUT;
                        if (waited >= maxWait) {
                            reject(new Error('The maps style took too long to load.'));
                        } else {
                            setTimeout(checkStyle, TIMEOUT);
                        }
                    }
                };
                checkStyle();
            });
        },

        /**
         * Add marker to map using layer
         * @param {Array} marker - Marker data properties 
         * @param {String} icon - URL for icon image
         * @method addMarker
         */
        addMarker(marker, icon) {
            this.map.addLayer({
                'id': marker.name,
                'type': 'symbol',
                'source': {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [{
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': marker.emp
                            }
                        }]
                    }
                },
                'layout': {
                    'icon-image': marker.pin,
                    'icon-size': 0.2,
                    "icon-allow-overlap": true,
                    "icon-ignore-placement": true,
                    "text-field": marker.idMarker,
                    "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                    "text-size": 15,
                    "text-offset": [0, -0.2]
                },
                "paint": {
                    "text-color": "#fff"
                },
            });

            this.map.on('click', marker.key, e => {
                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to
                while (Math.abs(e.lngLat.lng - marker.emp[0]) > 180) {
                    marker.emp[0] += e.lngLat.lng > marker.emp[0] ? 360 : -360;
                }

                this.testMarkerListeToggle = true;
                this.markerUpdateFormDialog = true;
                this.latitudeValue = marker.emp[1];
                this.longitudeValue = marker.emp[0];
                this.nameValue = marker.name;
                this.descriptionValue = marker.popup;
            });

            // Change the cursor to a pointer when the mouse is over the markers layer
            this.map.on('mouseenter', marker.key, () => {
                this.map.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to a pointer when it leaves.
            this.map.on('mouseleave', marker.key, () => {
                this.map.getCanvas().style.cursor = '';
            });
        },

        /**
         * Mark a map with the coordinates
         * @method markerLongLat
         * @return {void}
         */
        markerLongLat() {
            var img = this.imageToBase64(this.defaultColor);

            var lat = document.getElementById('markerLat').value;
            var lng = document.getElementById('markerLong').value;
            //var keys = Object.keys(localStorage);
            var keys = JSON.parse(localStorage.getItem('nameMarker'));
            if (keys != null) {
                for (var i = 0; i < keys.length; i++) {
                    var val = JSON.parse(localStorage.getItem(keys[i]));
                    var id = this.compteID() + 1;
                    var idMarker = null;
                    if (val.idMarker == id) {
                        idMarker = id + 1;
                    } else {
                        idMarker = id;
                    }
                }
            }
            var marker = {
                idMarker: idMarker.toString(),
                popup: document.getElementById('popupmsg').value,
                emp: ([parseFloat(lng), parseFloat(lat)]),
                image: img
            }

            /** create a DOM element for the marker */
            const element = document.createElement('div');
            element.className = 'marker';
            element.style.background = img;

            this.storeMarker(marker)

            /** Create a popup to marker */
            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML('<img src="' + this.image + '" height="80px" width="120px"><br>' + document.getElementById('popupmsg').value);

            /** create a marker */
            new mapboxgl.Marker(element)
                .setLngLat([document.getElementById('markerLong').value, document.getElementById('markerLat').value])
                .setPopup(popup)
                .addTo(this.map);

            //Fly to the coordinates
            this.map.flyTo({
                center: [
                    document.getElementById('markerLong').value,
                    document.getElementById('markerLat').value
                ]
            });
        },

        /**
         * Mark a map with the coordinates
         * @method coordinatesAddMarker
         * @return {void}
         */
        coordinatesAddMarker() {
            var lat = document.getElementById('markerLat').value;
            var lng = document.getElementById('markerLong').value;

            var customPopup = document.getElementById('popupmsg').value;

            var keys = JSON.parse(localStorage.getItem('nameMarker'));
            var id = this.compteID() + 1;
            var idMarker = null;
            var marker = {};
            if (keys != null) {
                for (var i = 0; i < keys.length; i++) {
                    var val = JSON.parse(localStorage.getItem(keys[i]));

                    if (val.idMarker == id) {
                        idMarker = id + 1;

                        marker = {
                            idMarker: idMarker.toString(),
                            popup: customPopup,
                            name: document.getElementById('markerName').value,
                            emp: ([parseFloat(lng), parseFloat(lat)]),
                            pin: this.$store.state.pinType,
                            key: document.getElementById('markerName').value
                        }
                    } else {
                        idMarker = id;
                        marker = {
                            idMarker: idMarker.toString(),
                            popup: customPopup,
                            name: document.getElementById('markerName').value,
                            emp: ([parseFloat(lng), parseFloat(lat)]),
                            pin: this.$store.state.pinType,
                            key: document.getElementById('markerName').value
                        }
                    }
                }
            } else {
                idMarker = id;
                marker = {
                    idMarker: idMarker.toString(),
                    popup: customPopup,
                    name: document.getElementById('markerName').value,
                    emp: ([parseFloat(lng), parseFloat(lat)]),
                    pin: this.$store.state.pinType,
                    key: document.getElementById('markerName').value,
                }
            }
            //this.storeMarker(marker);
            localStorage.setItem(document.getElementById('markerName').value, JSON.stringify(marker));
            // this.listeNameMarker.push(JSON.parse(localStorage.getItem('nameMarker')));
            var temp = JSON.parse(localStorage.getItem('nameMarker'));
            if (temp != null) {
                this.listeNameMarker = temp;
            }
            this.listeNameMarker.push(document.getElementById('markerName').value)
            localStorage.setItem('nameMarker', JSON.stringify(this.listeNameMarker))
            var geojson = {
                type: "FeatureCollection",
                features: [],
            }
            geojson.features.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": marker.emp
                },
                "properties": {
                    "id": document.getElementById('markerName').value,
                    "numero": marker.idMarker,
                    "name": document.getElementById('markerName').value,
                    "popup": marker.popup,
                    "key": document.getElementById('markerName').value
                }
            });
            this.addMarker(marker, this.$store.state.pinType);
            this.clearMarkerList();
            this.listAllMarker();
        },

        /** Change map style to dark */
        darkStyle() {
            this.map.setStyle(this.styleDark);
            this.markerLayerload();
            this.$store.state.styleMap = this.styleDark;
        },
        /** Change map style to bright */
        brightStyle() {
            this.map.setStyle(this.styleBright);
            this.markerLayerload();
            this.$store.state.styleMap = this.styleBright;
        },
        /** Change map style to night */
        nightStyle() {
            this.map.setStyle(this.styleNight);
            this.markerLayerload();
            this.$store.state.styleMap = this.styleNight;
        },
        /** Change map style to basic */
        basicStyle() {
            this.map.setStyle(this.styleBasic);
            this.markerLayerload();
            this.$store.state.styleMap = this.styleBasic;
        },
        /** Change map style to street */
        streetStyle() {
            this.map.setStyle(this.styleStreet);
            this.markerLayerload();
            this.$store.state.styleMap = this.styleStreet;
        },
        /** Change map style to satellite */
        satelliteStyle() {
            this.map.setStyle(this.styleSatellite);
            this.markerLayerload();
            this.$store.state.styleMap = this.styleSatellite;
        },

        /**
         * convert image to base64
         * @method imageToBase64
         * @param {string} pincolor - the color of image
         * @return {String} the base64 for image
         */
        imageToBase64(pincolor) {
            var svg = '<svg version="1.1" class="pinlogo" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 52 52" style="enable-background:new 0 0 52 52;" xml:space="preserve"> <path class="mark" fill="' + pincolor + '" d="M38.853,5.324L38.853,5.324c-7.098-7.098-18.607-7.098-25.706,0h0C6.751,11.72,6.031,23.763,11.459,31L26,52l14.541-21C45.969,23.763,45.249,11.72,38.853,5.324z M26.177,24c-3.314,0-6-2.686-6-6 s2.686-6,6-6s6,2.686,6,6S29.491,24,26.177,24z"/></svg>';
            var encoded = window.btoa(svg);
            var style = "url(data:image/svg+xml;base64," + encoded + ")";
            return style;
        },

        /**
         * Store the marker to localstorage and geojson data
         * @method storeMarker
         * @param {string} marker - A marker object
         * @return {void}
         */
        storeMarker(marker) {
            this.clearLog()
            console.log('liste avant', this.listeNameMarker)
            var coordinates = document.getElementById('place').getElementsByTagName('input');
            if (document.getElementById('markerName').value != '' && document.getElementById('popupmsg').value != null && coordinates[0].value != null) {
                localStorage.setItem(document.getElementById('markerName').value, JSON.stringify(marker));
                var temp = JSON.parse(localStorage.getItem('nameMarker'));
                if (temp != null) {
                    this.listeNameMarker = temp;
                }
                console.log('temp', temp)
                console.log('liste', this.listeNameMarker)
                    //this.listeNameMarker.push(JSON.parse(localStorage.getItem('nameMarker')));
                this.listeNameMarker.push(document.getElementById('markerName').value)
                localStorage.setItem('nameMarker', JSON.stringify(this.listeNameMarker))
                console.log(JSON.stringify(this.listeNameMarker))
                var geojson = {
                    type: "FeatureCollection",
                    features: [],
                }
                geojson.features.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": marker.emp
                    },
                    "properties": {
                        "id": document.getElementById('markerName').value,
                        "numero": marker.idMarker,
                        "name": document.getElementById('markerName').value,
                        "popup": marker.popup,
                        "key": document.getElementById('markerName').value
                    }
                });

                this.$store.state.idMarker = marker.idMarker;
            }
        },

        /**
         * Show sign in form
         * @method showForm
         * @return {boolean}
         */
        showForm() {
            return this.dialog = true
        },

        /**
         * Show marker toggle
         * @method allMarker
         */
        allMarker() {
            this.markerDrawer = false;
            this.clearLog()
            this.clearMarkerList()
            this.listAllMarker();
        },

        /**
         * Clear current list of markers
         * @method clearMarkerList
         */
        clearMarkerList() {
            var elem = document.getElementById("ulMarker");
            elem.parentNode.removeChild(elem)
        },

        /**
         * Clear current list of markers to flyer
         * @method clearFlyerMarkerList
         */
        clearFlyerMarkerList() {
            var elem = document.getElementById("ulflyerMarker");
            elem.parentNode.removeChild(elem)
        },

        /**
         * Convert json to geojson
         * @method jsonToGeojson
         * @return {Array}
         */
        jsonToGeojson() {
            var geojson = {
                type: "FeatureCollection",
                features: [],
            }
            this.clearLog()
                //var keys = Object.keys(localStorage);
            var keys = JSON.parse(localStorage.getItem('nameMarker'));
            if (keys != null) {
                keys.forEach(function(key) {
                    var markers = localStorage.getItem(key);
                    markers = JSON.parse(markers);
                    geojson.features.push({
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": markers.emp
                        },
                        "properties": {
                            "id": markers.idMarker,
                            "numero": markers.idMarker,
                            "name": markers.name,
                            "key": markers.name,
                            "popup": markers.popup,
                            "pin": markers.pin,
                            "key": document.getElementById('markerName').value
                        }
                    });
                });
            }
            return geojson;
        },

        /**
         * Load markers on map with mapboxgl.Marker
         * @method loadMarkersLayer
         * @return {void}
         */
        loadMarkersLayer() {
            this.clearLog()
            this.jsonToGeojson().features.forEach(marker => {
                /** create a DOM element for the marker */
                var el = document.createElement('div');
                el.className = 'marker';
                el.style.backgroundImage = marker.properties.image;

                /** create a popup for the marker */
                const popup = new mapboxgl.Popup({ offset: 25 })
                    .setHTML(marker.properties.popup);

                /** add marker to map */
                new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .setPopup(popup)
                    .addTo(this.map);
            });
        },

        /**
         * Load markers on map with layer
         * @method markerLayerload
         * @return {void}
         */
        markerLayerload() {
            this.clearLog()
            this.jsonToGeojson().features.forEach(marker => {
                this.mapLayer(marker, this.$store.state.pinType, 1000);
            });
        },

        /**
         * List of all markers
         * @method listAllMarker
         * @return {void}
         */
        listAllMarker() {
            var ul = document.createElement('ul');
            ul.id = 'ulMarker';
            document.getElementById('liste').appendChild(ul);
            this.jsonToGeojson().features.forEach(marker => {
                var li = document.createElement('li');
                li.id = 'listeMarker';
                li.className = marker.properties.key;
                ul.appendChild(li);
                li.innerHTML += '<span style="display: none">' + marker.properties.numero + '-&nbsp;</span><span class="markerTitle" >' + marker.properties.name + '</span>&nbsp;<v-btn class="btn btn-primary btnDelMarker" id="btnDelMarker"></v-btn>';

                /** Remove marker in localStorage and in the map layer */
                li.childNodes[3].addEventListener('click', () => {
                    var suppr = marker.properties.name;
                    localStorage.removeItem(suppr);

                    var aSupprimer = localStorage.getItem('nameMarker');
                    this.listeNameMarker = JSON.parse(aSupprimer);
                    var index = this.listeNameMarker.indexOf(suppr);
                    if (index > -1) {
                        this.listeNameMarker.splice(index, 1);
                    }
                    localStorage.setItem('nameMarker', JSON.stringify(this.listeNameMarker));
                    localStorage.removeItem('loglevel:webpack-dev-server');
                    this.clearMarkerList()
                    this.listAllMarker()
                    this.updateNumberMarker(marker.properties.numero);
                    try {
                        this.map.removeLayer(suppr);
                    } catch (e) {

                    }
                    this.map.removeSource(suppr);
                });

                /** Fly to marker location */
                li.addEventListener('click', e => {

                });
            })
        },

        /**
         * Print map to PDF 
         * 
         * @method print
         */
        print() {
            var printPdf = require('mapbox-print-pdf');
            this.spinner = true;
            document.getElementById('exportPDF').disabled = true;

            this.mapPrintLegend()
            var template = `
                <div data-scale-height="margin-top" id="footer" class="footer">
                    <ul id="ulLegende">
                        <li id="listeLegende"></li>
                    </ul>
                </div>
            `;

            var elementClonedCb = (elem) => {
                elem.removeAttribute("id");
            }

            printPdf.build()
                .format("a2")
                .footer({
                    html: document.getElementById('footer'),
                    baseline: { format: "a4", orientation: "p" }
                }, elementClonedCb)
                .scale({ maxWidthPercent: 10, unit: "metric" })
                .print(this.map, mapboxgl)
                .then((pdf) => {
                    pdf.save("map.pdf");
                    this.spinner = false;
                    this.printForm = false;
                    document.getElementById('exportPDF').disabled = false;
                });
        },

        /**
         * Print map to PDF 
         * 
         * @method customPrint
         */
        customPrint() {
            var printPdf = require('mapbox-print-pdf');
            this.spinner = true;
            var nameMapExport = document.getElementById('namePrint').value;
            if (nameMapExport == '') {
                nameMapExport = "map";
            }
            if (this.select.abbr == '') {
                this.select.abbr = 'a4';
            }

            this.stateExportBtn(true);

            var liste = null;
            this.jsonToGeojson().features.forEach(marker => {
                liste += '<p style="width: 300px; height: 300px"><span>' + marker.properties.numero + '-&nbsp;</span>' + marker.properties.popup + '<br><span class="markerTitle" >' + marker.properties.name + '</span><br></p>';
            });

            var template = `
                <div data-scale-height="" id="conteneur" class="conteneur">` + liste + `</div>
            `;

            var temp = `
            <div data-scale-height="margin-top" id="footer" class="footer">
                <p data-scale-sum="font-size" class="info"><span>Created with</span>: © Mapbox, © OpenStreetMap
                <span>Author</span>: Eddie Larsson</p>
            </div>
            `

            var elementClonedCb = (elem) => {
                elem.removeAttribute("id");
            }
            console.log(this.select.abbr, 'format')
            printPdf.build()
                .landscape()
                .format(this.select.abbr)
                /*.footer({
                    html: document.getElementById("flyer").innerHTML,
                    baseline: { format: this.select.abbr, orientation: "l" }
                }, elementClonedCb)*/
                .scale({ maxWidthPercent: 10, unit: "metric" })
                .print(this.map, mapboxgl)
                .then((pdf) => {
                    pdf.save(nameMapExport + ".pdf");
                    this.spinner = false;
                    this.printForm = false;
                    this.stateExportBtn(false);
                });
        },

        /**
         * State of export button for print
         * @method stateExportBtn
         * @param {Boolean} state 
         */
        stateExportBtn(state) {
            if (state == true) {
                document.getElementById('exportPDF').disabled = true;
            } else {
                document.getElementById('exportPDF').disabled = false;
            }
        },

        stateSaveBtn(state) {
            if (state == false) {
                document.getElementById('saveMarker').disabled = true;
            } else {
                if (document.getElementById('popupmsg').value != '' && document.getElementById('markerName').value != '') {
                    document.getElementById('saveMarker').disabled = false;
                } else {
                    document.getElementById('saveMarker').disabled = true;
                }
            }
        },

        /**
         * Update localstorage data
         * @param {String} value localStorage key
         * @param {Number} longitude 
         * @param {Number} latitude
         * @method updateStorage 
         */
        updateStorage(value, longitude, latitude) {
            var request = localStorage.getItem(value);
            if (request != null) {
                var data = JSON.parse(request);
                data.emp[0] = longitude;
                data.emp[1] = latitude;
                localStorage.setItem(value, JSON.stringify(data))
                console.log('Data exist', data);
            } else {
                console.log('Data inexist')
            }
        },

        /**
         * Update marker data
         * @method updateMarker 
         */
        updateMarker() {
            var value = this.nameValue;
            var request = localStorage.getItem(value);
            console.log('value', value)
            console.log('request', request)
            if (request != null) {
                var data = JSON.parse(request);
                data.emp[0] = document.getElementById('longitudeMarkerUpdate').value;
                data.emp[1] = document.getElementById('latitudeMarkerUpdate').value;
                data.popup = document.getElementById('descriptionMarkerUpdate').value;
                data.pin = this.$store.state.pinType;
                localStorage.setItem(value, JSON.stringify(data));
                console.log('Data', data);

                this.jsonToGeojson().features.forEach(marker => {
                    this.map.removeLayer(marker.properties.name);
                    this.map.removeSource(marker.properties.name);
                    this.mapLayer(marker, marker, 1000);
                })
            } else {}
            //this.$refs.formUpdate.reset();
            this.clearMarkerList();
            this.listAllMarker();
            this.markerUpdateFormDialog = false;
        },

        /**
         * Update marker number
         * @param {Number} numeroToRemove
         * @method updateNumberMarker 
         */
        updateNumberMarker(numeroToRemove) {
            var request = JSON.parse(localStorage.getItem('nameMarker'));
            if (request != null) {
                request.forEach(key => {
                    var numero = JSON.parse(localStorage.getItem(key));
                    if (numero.idMarker > numeroToRemove) {
                        numero.idMarker = (numero.idMarker - 1).toString();
                        localStorage.setItem(key, JSON.stringify(numero));

                    }
                })
                this.jsonToGeojson().features.forEach(marker => {
                    this.map.removeLayer(marker.properties.name);
                    this.map.removeSource(marker.properties.name);
                    this.mapLayer(marker, marker, 1000);
                })
            } else {}
            //this.$refs.formUpdate.reset();
            this.markerUpdateFormDialog = false;
        },

        /**
         * @method clearLog - Remove loglevel:webpack-dev-server to localstorage
         */
        clearLog() {
            localStorage.removeItem('loglevel:webpack-dev-server');
        },

        /**
         * Recupere URL of uploaded image
         * @param {String} file - Image selected
         * @method onImageFileChange
         * @returns {String} - image url to base64 
         */
        onImageFileChange(file) {
            var files = file[0];
            var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
            if (files.size > 500000) {} else if (!allowedExtensions.exec(files.name)) {
                this.alertImageError = true;
                document.getElementById('file').value = '';
                return false;
            } else {
                var fr = new FileReader();
                fr.onload = () => {
                    this.image = fr.result;
                }
                fr.readAsDataURL(files);
            }
        },

        /**
         * Recupere URL of uploaded image
         * @param {String} file - Image selected
         * @method onImageFlyerChange
         * @returns {String} - image url to base64 
         */
        onImageFlyerChange(file) {
            var files = file[0];
            var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
            if (files.size > 500000) {
                console.log('Fichier lourd', files.size)
            } else if (!allowedExtensions.exec(files.name)) {
                this.alertImageErrorFlyer1 = true;
                document.getElementById('fileFlyer1').value = '';
                return false;
            } else {
                var fr = new FileReader();
                fr.onload = () => {
                    this.imageFlyer = fr.result;
                }
                fr.readAsDataURL(files);
            }
        },

        /**
         * Recupere URL of uploaded image
         * @param {String} file - Image selected
         * @method onImageMapFlyerChange
         * @returns {String} - image url to base64 
         */
        onImageMapFlyerChange(file) {
            var files = file[0];
            var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
            console.log(files.size)
            console.log('value', files.name)
            if (files.size > 500000) {
                console.log('Fichier lourd', files.size)
            } else if (!allowedExtensions.exec(files.name)) {
                this.alertImageErrorFlyer2 = true;
                document.getElementById('fileFlyer2').value = '';
                return false;
            } else {
                var fr = new FileReader();
                fr.onload = () => {
                    this.imageMapFlyer = fr.result;
                    console.log(this.imageFlyer)
                        //sessionStorage.setItem('imageFlyer', )
                }
                fr.readAsDataURL(files);
            }
        },

        /**
         * Count number of key in localstorage to calculate number of marker
         * @method compteID
         * @return {Number} - Number of key
         */
        compteID() {
            var a = JSON.parse(localStorage.getItem('nameMarker'));
            //var keys = Object.keys(localStorage);
            var keys = JSON.parse(localStorage.getItem('nameMarker'));
            //console.log('keys', keys.length)
            if (keys == null) {
                return 0;
            } else if (keys.length == 0) {
                return 1;
            } else {
                return keys.length;
            }
            /*if (keys[0] == "loglevel:webpack-dev-server" || keys[0] == '') {
                return 0;
            }
            else {
                return keys.length;
            }*/
        },
        /**
         * List of all markers in the flyer
         * @method flyerListMarker
         * @return {void}
         */
        flyerListMarker() {
            var ul = document.createElement('ul');
            ul.id = 'ulflyerMarker';
            document.getElementById('flyerMarker').appendChild(ul);
            this.jsonToGeojson().features.forEach(marker => {
                var li = document.createElement('li');
                li.id = 'listeFlyerMarker';
                li.className = marker.properties.name;
                ul.appendChild(li);
                li.innerHTML += '<span style="display: none">' + marker.properties.numero + '-&nbsp;</span><span class="markerTitle" >' + marker.properties.name + '</span>';
            })
        },

        switchMapFlyer() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(this.map.resize())
                }, 1000)
            })
        },

        mapFlyer() {
            /** Mapbox access token */
            //mapboxgl.accessToken = this.accessToken
            /** Draw map */
            /*this.mapFlyers = new mapboxgl.Map({
                container: 'mapFlyer',
                style: this.$store.state.styleMap,
                center: this.$store.state.coordinates,
                zoom: 12,
                pitch: 0,
                bearing: 360,
                interactive: true,
            });*/
            this.clearFlyerMarkerList();
            this.flyerListMarker()
        },

        onEditorChange({ editor, html, text }) {
            this.content = html;
        },

        onEditor1Change({ editor, html, text }) {
            this.content1 = html;
        },

        onEditor2Change({ editor, html, text }) {
            this.content2 = html;
        },

        onEditor3Change({ editor, html, text }) {
            this.content3 = html;
        },

        onEditor4Change({ editor, html, text }) {
            this.content4 = html;
        },

        preloader() {
            setTimeout(() => {
                document.getElementById('preloader').style.display = 'none';
            }, 6000)
        },

        clone() {
            document.getElementById('clone').click();
        },
    },
    props: {
        source: String,
        // Use "value" to enable using v-model
        value: Object,
    }
}