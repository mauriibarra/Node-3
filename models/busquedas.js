import axios from 'axios'
import fs from 'fs';

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor () {  // El método constructor es un metodo especial para crear e inicializar un objeto creado a partir de una clase.
        // TO-DO Leer DB si existe
    }

    get paramsMapBox () {
        return {
            'access_token': process.env.MAPBOX_KEY,
                'limit': 5,
                'language': 'es'
        }
    }

    async ciudad ( lugar = '') {

        try {

        // Peticion http
        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
            params: this.paramsMapBox
        })
        const resp =await instance.get();

        //const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/madrid.json?proximity=ip&language=es&access_token=pk.eyJ1IjoibWF1cmktaWJhcnJhIiwiYSI6ImNsZnE1d2p5OTFjZmEzb21vZHlhaGxpaHoifQ.2d-wW1OiCX0bWE1aiJ4UUA&limit=5');
        
        return resp.data.features.map( lugar => ({      // Pongo las llaves entre parentesis para devolver un objeto de forma implicita
            id: lugar.id,
            nombre: lugar.place_name,
            longitud: lugar.center[0],
            latitud: lugar.center[1]
        }) )     

        } catch (error) {
            
            return[];

        }

    }

    get paramsWather () {
        return {
            'appid': process.env.OPENWATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async climaLugar ( lat, lon ) {

        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsWather, lat, lon}    // Utilizando destructuracion
            })
            
        const resp = await instance.get();
        const { weather, main } = resp.data;

        return {
            desc: weather[0].description,
            min: main.temp_min,
            max: main.temp_max,
            temp: main.temp
        }

        } catch (error) {
            console.log(error)
        }

    }


    agregarHistorial ( lugar = '' ) {

        if(this.historial.includes( lugar.toLocaleLowerCase() )) {
            return
        }

        this.historial.unshift(lugar.toLocaleLowerCase() ); 

        // Para guardar en DB
        this.guardarDB();

    }

    guardarDB() {

        const payload = {
            historial: this.historial
        };
        fs.writeFileSync( this.dbPath, JSON.stringify(payload) );

    }

    leerDB() {

        if( !fs.existsSync(this.dbPath) ) {
            return;
        };

        const info = fs.readFileSync( this.dbPath, {encoding: 'utf-8'} );
        const data = JSON.parse(info);

        this.historial = data.historial;

    }

}


export {
    Busquedas
}