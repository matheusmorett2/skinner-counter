import React, { Component } from 'react';
import Stopwatch from './Stopwatch';
import { CSVLink, CSVDownload } from "react-csv";
import _ from 'lodash'
import logo from './logo.svg';
import './App.css';

const formattedSeconds = (sec) =>
  Math.floor(sec / 60) +
  ':' +
  ('0' + sec % 60).slice(-2)


class App extends Component {



  constructor(props) {
    super(props)

    this.state = {
      andar: [],
      farejar: [],
      cocar: [],
      lamber: [],
      subir: [],
      start: false,
      secondsElapsed: 0,
      laps: [],
      lastClearedIncrementer: null,
      showCsv: false
    }

    this.incrementer = null;
  }

  handleStartClick() {
    this.incrementer = setInterval(() =>
      this.setState({
        secondsElapsed: this.state.secondsElapsed + 1
      })
      , 1000);
  }

  handleStopClick() {
    clearInterval(this.incrementer);
    this.setState({
      lastClearedIncrementer: this.incrementer
    });
  }

  handleResetClick() {
    clearInterval(this.incrementer);
    this.setState({
      secondsElapsed: 0,
      laps: [],
      andar: [],
      farejar: [],
      cocar: [],
      lamber: [],
      subir: [],
      tempo: [],
      start: false
    });
  }

  handleLabClick() {
    this.setState({
      laps: this.state.laps.concat([this.state.secondsElapsed])
    })
  }

  andar() {
    const { andar } = this.state

    andar.push({
      acao: 'Andar',
      tempo: formattedSeconds(this.state.secondsElapsed)
    })

    this.setState({
      andar: andar
    })
  }

  farejar() {
    const { farejar } = this.state

    farejar.push({
      acao: 'Farejar',
      tempo: formattedSeconds(this.state.secondsElapsed)
    })

    this.setState({
      farejar: farejar
    })
  }

  cocar() {
    const { cocar } = this.state

    cocar.push({
      acao: 'Coçar',
      tempo: formattedSeconds(this.state.secondsElapsed)
    })

    this.setState({
      cocar: cocar
    })
  }

  lamber() {
    const { lamber } = this.state
    lamber.push({
      acao: 'Lamber',
      tempo: formattedSeconds(this.state.secondsElapsed)
    })

    this.setState({
      lamber: lamber
    })
  }

  subir() {
    const { subir } = this.state

    subir.push({
      acao: 'Subir',
      tempo: formattedSeconds(this.state.secondsElapsed)
    })

    this.setState({
      subir: subir
    })
  }

  getCsv() {
    let arrayFinal = []

    arrayFinal.push(...this.state.andar)
    arrayFinal.push(...this.state.farejar)
    arrayFinal.push(...this.state.cocar)
    arrayFinal.push(...this.state.lamber)
    arrayFinal.push(...this.state.subir)


    arrayFinal = _(arrayFinal)
      .groupBy(ar => ar.acao)
      .value();

    arrayFinal.Andar = _(arrayFinal.Andar)
      .groupBy(ar => Math.ceil(ar.tempo.replace(':', '.')))
      .map((value, key) => ({ Minuto: key, Quantidade: value.length, Ação: 'Andar' }))
      .value()

    arrayFinal.Farejar = _(arrayFinal.Farejar)
      .groupBy(ar => Math.ceil(ar.tempo.replace(':', '.')))
      .map((value, key) => ({ Minuto: key, Quantidade: value.length, Ação: 'Farejar' }))
      .value()


    arrayFinal.Cocar = _(arrayFinal.Cocar)
      .groupBy(ar => Math.ceil(ar.tempo.replace(':', '.')))
      .map((value, key) => ({ Minuto: key, Quantidade: value.length }))
      .value()

    arrayFinal.Lamber = _(arrayFinal.Lamber)
      .groupBy(ar => Math.ceil(ar.tempo.replace(':', '.')))
      .map((value, key) => ({ Minuto: key, Quantidade: value.length, Ação: 'Lamber' }))
      .value()

    arrayFinal.Subir = _(arrayFinal.Subir)
      .groupBy(ar => Math.ceil(ar.tempo.replace(':', '.')))
      .map((value, key) => ({ Minuto: key, Quantidade: value.length }))
      .value()


    arrayFinal = [
      ...arrayFinal.Andar,
      ...arrayFinal.Farejar,
      ...arrayFinal.Cocar,
      ...arrayFinal.Lamber,
      ...arrayFinal.Subir
    ]

    return arrayFinal

  }

  render() {
    const { andar, farejar, cocar, lamber, subir, tempo, start } = this.state

    return (
      <div className="App">
        <div className='head'>
          Contato Skinner
        </div>

        <div className="stopwatch">
          <h1 className="stopwatch-timer">{formattedSeconds(this.state.secondsElapsed)}</h1>

          {(this.state.secondsElapsed === 0 ||
            this.incrementer === this.state.lastClearedIncrementer
            ? <button className="start-btn" onClick={this.handleStartClick.bind(this)}>Start</button>
            : <button className="out" onClick={this.handleStopClick.bind(this)}>Stop</button>
          )}
          <button className="out" onClick={this.handleResetClick.bind(this)}>Reset</button>
          <ul className="stopwatch-laps">
            {this.state.laps.map((lap, i) =>
              <li className="stopwatch-lap"><strong>{i + 1}</strong>/ {formattedSeconds(lap)}</li>)
            }
          </ul>
        </div>
        <div>
          <button onClick={() => this.andar()}>(A) Andar {andar.length}</button>
          <button onClick={() => this.farejar()}>(S) Farejar {farejar.length}</button>
          <button onClick={() => this.cocar()}>(D) Coçar {cocar.length}</button>
          <button onClick={() => this.lamber()}>(F) Lamber {lamber.length}</button>
          <button onClick={() => this.subir()}>(G) Subir {subir.length}</button>
        </div>


        <button className='low out' onClick={() => {
          this.setState({
            showCsv: true
          })
        }}>
          Relatório
        </button>
        {(this.state.showCsv && <CSVLink
          data={this.getCsv()}
          asyncOnClick={true}
          onClick={() => {
            this.setState({
              showCsv: false,
              baixou: true
            })
          }}
        >
          <button className='low out'>
            Agora clique aqui
        </button>
        </CSVLink>)}
        {(this.state.baixou && <p>
          Fico feliz que tenha baixado, zap: 41 9 9169-8884
        </p>)}

      </div>
    );
  }
}

export default App;
