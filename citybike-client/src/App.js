import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import NavBar from "./componets/NavBar";
import Icons from "./componets/Icons";
import Replay from "./componets/Replay";
import "./App.css";

class App extends Component {
  constructor() {
    super();

    this.state = {
      response: [],
      responseReplay: {},
      statusReplay: "current",
      endpoint: "http://127.0.0.1:4001",
      lat: 25.790654,
      lng: -80.1300455,
      zoom: 13,
    };
  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    console.log(new Date(), "start");
    socket.on("FromcitybikeApi", (data) => {
      this.setState({ response: data.stations });
      [1, 2, 3, 4, 5].forEach((item) => {
        this.replayUpdate(
          {
            [`${item}-minute`]: {
              data: [
                ...data.stations,
                //This Object it is a test Data for  replay ans show markupt in the
                {
                  empty_slots: item * 10,
                  extra: {
                    address: "N. Bayshore Dr btw NE 17th & 18th St",
                    uid: "653",
                  },
                  free_bikes: item * 6,
                  id: "9161fbfabd252113b2d47320427b3836",
                  latitude: 25.773761,
                  longitude: -80.168089,
                  name: `Andres Test replay ${item}-minute`,
                  timestamp: "2020-06-21T02:57:18.690000Z",
                },
              ],
              date: new Date(),
            },
          },
          this.getMinutes(item)
        );
      });
    });
  }

  changeStatus = (string) => {
    this.setState({ statusReplay: string });
  };

  getMinutes = (number) => {
    return number * 60 * 1000;
  };

  getcolor = (empty_slots, free_bikes) => {
    if (free_bikes === 0) {
      return "red";
    } else if (empty_slots / 2 > free_bikes) {
      return "orange";
    }
    return "green";
  };

  replayUpdate = (data, timeout) => {
    setTimeout(() => {
      this.setState({
        responseReplay: {
          ...this.state.responseReplay,
          ...data,
        },
      });
    }, timeout);
  };

  render() {
    const { response, responseReplay, statusReplay } = this.state;
    const position = [this.state.lat, this.state.lng];
    const dataCurrent = {
      current: { data: response, date: new Date() },
      ...responseReplay,
    };
    return (
      <div className="map">
        <NavBar />
        <Map center={position} zoom={this.state.zoom} className="map-view">
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {dataCurrent[statusReplay].data.map(
            ({
              latitude,
              longitude,
              name,
              empty_slots,
              free_bikes,
              ...rest
            }) => {
              const position = [latitude, longitude];
              const color = this.getcolor(empty_slots, free_bikes);

              const icon = L.divIcon({
                className: "custom-icon",
                html: ReactDOMServer.renderToString(
                  <Icons type="Bike" perc={name} fill={color} />
                ),
              });
              return (
                <Marker key={name} position={position} icon={icon}>
                  <Popup>
                    <p>{name}</p>
                    <p>Bikes {free_bikes}</p>
                    <p>Slots: {empty_slots}</p>
                  </Popup>
                </Marker>
              );
            }
          )}
        </Map>
        <Replay
          data={dataCurrent}
          status={statusReplay}
          changeStatus={(status) => {
            this.changeStatus(status);
          }}
        />
      </div>
    );
  }
}
export default App;
