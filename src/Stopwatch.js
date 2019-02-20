import React, { Component } from 'react';

const formattedSeconds = (sec) =>
    Math.floor(sec / 60) +
    ':' +
    ('0' + sec % 60).slice(-2)


export default class Stopwatch extends Component {
    static defaultProps = {
        reset: () => { }
    }

    constructor(props) {
        super(props);
        this.state = {
            secondsElapsed: 0,
            laps: [],
            lastClearedIncrementer: null
        };
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
            laps: []
        });

        this.props.reset()
    }

    handleLabClick() {
        this.setState({
            laps: this.state.laps.concat([this.state.secondsElapsed])
        })
    }

    render() {
        return (
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
        );
    }
}