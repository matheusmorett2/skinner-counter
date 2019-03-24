import React, { Component } from 'react';
import Stopwatch from './Stopwatch';
import { CSVLink, CSVDownload } from "react-csv";
import Switch from "react-switch";
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
      showCsv: false,
      teclado: false
    }

    this.incrementer = null;
  }

  componentDidMount() {
    document.addEventListener("keydown", this._handleKeyDown);
  }


  _handleKeyDown = (event) => {
    if (this.state.teclado === true) {
      if (event.keyCode === 65) {
        this.andar()
      }

      if (event.keyCode === 83) {
        this.farejar()
      }

      if (event.keyCode === 68) {
        this.cocar()
      }

      if (event.keyCode === 70) {
        this.lamber()
      }

      if (event.keyCode === 71) {
        this.subir()
      }
    }
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
      .map((value, key) => ({ Minuto: key, Quantidade: value.length, Ação: 'Coçar' }))
      .value()

    arrayFinal.Lamber = _(arrayFinal.Lamber)
      .groupBy(ar => Math.ceil(ar.tempo.replace(':', '.')))
      .map((value, key) => ({ Minuto: key, Quantidade: value.length, Ação: 'Lamber' }))
      .value()

    arrayFinal.Subir = _(arrayFinal.Subir)
      .groupBy(ar => Math.ceil(ar.tempo.replace(':', '.')))
      .map((value, key) => ({ Minuto: key, Quantidade: value.length, Ação: 'Subir' }))
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
        <div className="developer">
          Feito por: Matheus Morett
        </div>
        <div className='head'>
          Contador Skinner
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
        {(this.state.baixou && <p>Obrigado por utilizar o Contador Skinner</p>)}

        <p>
          Gente, lancei uma atualização e agora funciona pelo teclado, blz?
          <br />
          Tem esse switch pra ativar e desativar, bjs...
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Ativar teclado: <Switch
            onChange={() => this.setState({ teclado: !this.state.teclado })}
            checked={this.state.teclado}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={48}
            className="react-switch"
            id="material-switch"
          />
        </div>
      </div>
    );
  }
}

export default App;
