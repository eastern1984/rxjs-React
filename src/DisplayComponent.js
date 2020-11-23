import React, { useState, useLayoutEffect } from 'react';
import dataStore from './store/observable';

export const DisplayComponent = (props) => {
    const [measures, setMeasures] = useState(useState(dataStore.initialState));
    useLayoutEffect(()=> {
        dataStore.subscribe(setMeasures);
        dataStore.init();
    },[]);

    return (
        <div className="DisplayComponent">
            <div className="div-data">Pressure: {measures.data?.pressure}</div>
            <div className="div-data">Temp: {measures.data?.temp}</div>
            <div className="div-data">Humidity: {measures.data?.humidity}</div>
        </div>
    );
};

export default DisplayComponent;