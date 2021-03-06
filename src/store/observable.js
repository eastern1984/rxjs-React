import React, {useEffect} from 'react';
import { Subject } from 'rxjs';

const subject = new Subject();

export const initialState = {
    data: {
        pressure: null,
        temp: null,
        humidity: null
    }
};

export let state = initialState;

export const useObservable = (setter) => {
    let subscription;
    let interval;

    useEffect(() => {
        subscription = dataStore.subscribe(setter);
        interval = dataStore.init();

        return () => {
            subscription.unsubscribe();
            clearInterval(interval);
        }
    },[])
};


const dataStore = {
    updateData: false,
    timerTemp: null,
    timerHum: null,
    timerPres: null,
    emit: (state) => {
        dataStore.updateData = (state.data.pressure !== null) && (state.data.temp !== null) && (state.data.humidity !== null);  // All 3 systems must emit at least one value before 1 display object is ever sent to the dashboard.
    },
    init: () => {
        return setInterval(() => {
            if (dataStore.updateData) {
                subject.next(state);
                dataStore.updateData = false;
            }
        }, 100); // Display object should not be emitted more often than every 100ms
    },
    subscribe: setState => subject.subscribe(setState),
    receiveTemp: temp => {
        clearTimeout(dataStore.timerTemp);
        state = { data: {...state.data, temp}};
        dataStore.emit(state);  // Display object should only be emitted when one of the systems sends a new value
        dataStore.timerTemp = setTimeout( () => {
            state = { data: {...state.data, temp: "N/A"}};  // If a value is not received from a specific system for more than 1000ms ....
            dataStore.emit(state);
        }, 1000);
    },
    receivePres: pressure => {
        clearTimeout(dataStore.timerPres);
        state = { data: {...state.data, pressure}};
        dataStore.emit(state);  // Display object should only be emitted when one of the systems sends a new value
        dataStore.timerPres = setTimeout( () => {
            state = { data: {...state.data, pressure: "N/A"}};  // If a value is not received from a specific system for more than 1000ms ....
            dataStore.emit(state); // Display object should only be emitted when one of the systems sends a new value
        }, 1000);
    },
    receiveHum: humidity => {
        clearTimeout(dataStore.timerHum);
        state = { data: {...state.data, humidity}};
        dataStore.emit(state);  // Display object should only be emitted when one of the systems sends a new value
        dataStore.timerHum = setTimeout( () => {
            state = { data: {...state.data, humidity: "N/A"}}; // If a value is not received from a specific system for more than 1000ms ....
            dataStore.emit(state);
        }, 1000);
    },
    initialState
};

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Backend imitation

(function temploop() {
    const rand = getRandomArbitrary(100, 2000);
    setTimeout(function() {
        dataStore.receiveTemp((Math.random() * 100).toFixed(1));
        temploop();
    }, rand);
}());

(function presloop() {
    const rand = getRandomArbitrary(100, 2000);
    setTimeout(function() {
        dataStore.receivePres((Math.random() * 100).toFixed(1));
        presloop();
    }, rand);
}());

(function humloop() {
    const rand = getRandomArbitrary(100, 2000);
    setTimeout(function() {
        dataStore.receiveHum((Math.random() * 100).toFixed(1));
        humloop();
    }, rand);
}());

export default dataStore;