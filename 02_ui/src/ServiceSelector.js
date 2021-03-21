import React from 'react';
import './ServiceSelector.css';

{/* <img src={"/assets/car_" + this.props.color + ".png"} */}

class ServiceSelector extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            value: 0
        }
    }

    service_clicked = val => {
        if(this.props.go_to_service)
            this.props.go_to_service(val)
    }

    render () {
        return (
            <div className="item">
                <div className="ss_container">
                    <button className="ss_service_container" onClick={() => this.service_clicked(1)}>
                        <div className="ss_img_container">
                            <span className="ss_img_helper"></span>
                            <img className="ss_img" src={"/assets/qr_code.png"} />
                        </div>
                        <p>Tickets</p>
                    </button>
                    <button className="ss_service_container" onClick={() => this.service_clicked(1)}>
                        <div className="ss_img_container">
                            <span className="ss_img_helper"></span>
                            <img className="ss_img" src={"/assets/easy_park.png"} />
                        </div>
                        <p>EasyPark</p>
                    </button>
                    <div className="clearFloat"></div>
                </div>              
            </div>
        )
    }
}

export {ServiceSelector}