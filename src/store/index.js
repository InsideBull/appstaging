import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

/**
 * Store states
 * @type {Object}
 */
const state = {
    pinType: 'red_pin',
    mapLocation: JSON.parse(localStorage.getItem('location')),
    coordinates: [2.321, 48.859],
    styleMap: 'mapbox://styles/aradimison/cjna2houh3x4l2sk739b4pers',
    idMarker: 0,
    zoom: JSON.parse(localStorage.getItem('zoom')),
};

/**
 * Store mutations
 * @type {Object}
 */
const mutations = {};

/**
 * Store actions
 * @type {Object}
 */
const actions = {};

/**
 * Vuex storage instance
 * @type {Vuex}
 */
const mainStorage = new Vuex.Store({
    state,
    mutations,
    actions
});

/**
 * Module export
 */
export default mainStorage;