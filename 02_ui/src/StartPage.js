import React from 'react';
import './StartPage.css';

class StartPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            intro_stage: 1
        }
    }

    close_start = () => {
        if(this.props.callback)
            this.props.callback()
    }

    next_stage = () => {
        if(this.state.intro_stage === 1) {
            this.setState({intro_stage: 2});
        }
        else {
            this.close_start()
        }
    }

    render () {
        if(this.state.intro_stage === 1)
        {
            return (
                <div className="sp_main_container">
                    <span className="sp_close_x" onClick={() => this.close_start()}>&times;</span>

                    {/* <img className="sp_zoom_img" src="assets/zoom.png" /> */}

                    <div className="sp_left_container">
                        <h1>Welcome to our project demo!</h1>
                        <h2 className="sp_undertitle"><i>Team Halt on Request</i></h2>
                        <p className="sp_text">We developed a prototype as close as possible to the current SBB App implementations.</p>
                        <p className="sp_text">It was developed using <code>React.JS</code></p>

                        <h3 className="sp_authors">Authors:</h3>
                        <p className="sp_authors_name"><a className="sp_authors_link" href="https://https://www.linkedin.com/in/yvan-bosshard/">Yvan Bosshard</a>, ETH Zurich</p>
                        <p className="sp_authors_name"><a className="sp_authors_link" href="https://www.linkedin.com/in/tiago-salzmann-888818164/">Tiago Salzmann</a>, ETH Zurich</p>
                        <p className="sp_authors_name"><a className="sp_authors_link" href="https://www.linkedin.com/in/achilleas-mitrotasios/">Achilleas Mitrotasio</a>, University College London</p>
                        <p className="sp_authors_name"><a className="sp_authors_link" href="https://www.linkedin.com/in/kindl/">Christopher Kindl</a>, University College London</p>
                        <button className="sp_close_button" onClick={() => this.next_stage()}><p>Next</p></button>
                    </div>
                </div>
            )
        }
        else
        {
            return (
                <div className="sp_main_container">
                    <span className="sp_close_x" onClick={() => this.close_start()}>&times;</span>

                    <img className="sp_zoom_img" src="assets/zoom.png" />

                    <div className="sp_left_container">
                        <h1>For a better experience</h1>
                        <p className="sp_text">Use the zoom controls to zoom in/out</p>
                        <button className="sp_close_button" onClick={() => this.next_stage()}><p>Got it!</p></button>
                    </div>
                </div>
            )
        }
    }
}

export {StartPage}