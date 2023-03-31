import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'

import {leerInput, inquirerMenu, pausa, listarLugares} from './helpers/inquirer.js';
import {Busquedas} from './models/busquedas.js'


//console.log(process.env.MAPBOX_KEY);

const main = async() => {

    console.clear();
    const busquedas = new Busquedas();
    let opt;

    do {

    opt = await inquirerMenu();

    switch (opt) {

        case 1:
        //Mostrar mensaje
        const lugar = await leerInput ('Ciudad: ');

        //Buscar los lugares
        const lugares = await busquedas.ciudad (lugar);

        //Seleccionar un lugar
        const id = await listarLugares(lugares);
        if (id==='0') continue;
        const lugarSeleccionado = lugares.find( l => l.id === id )

        //Guardar el lugar seleccionado en DB
        busquedas.agregarHistorial( lugarSeleccionado.nombre );

        // console.log({ lugarSeleccionado });

        //Clima
        const clima = await busquedas.climaLugar( lugarSeleccionado.latitud, lugarSeleccionado.longitud );
        // console.log(clima);

        //Mostrar resultados
        console.clear();
        console.log('\nInformacion de la ciudad\n'.green);
        console.log('Ciudad: ', lugarSeleccionado.nombre );
        console.log('Latitud: ', lugarSeleccionado.latitud);
        console.log('Longitud: ', lugarSeleccionado.longitud);
        console.log('Temperatura: ', clima.temp);
        console.log('Minima: ', clima.min);
        console.log('Maxima: ', clima.max);
        console.log('Descripcion : ', clima.desc);
        
        break;

        case 2:

        busquedas.historial.forEach((lugar, i) => {
            const idx = `${ i + 1 }.`.green;
            console.log( `${ idx } ${ lugar }` );
        })

        break;

    }


    // console.log({opt});

    await pausa();
        
    } while (opt !== 0);
    
    
}

main();