import React from 'react';
import './ServiceSelector.css';

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
                    <button className="ss_service_container" onClick={() => this.service_clicked(3)}>
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
                    <button className="ss_service_container" onClick={() => this.service_clicked(2)}>
                        <div className="ss_img_container">
                            <span className="ss_img_helper"></span>
                            <img className="ss_img" src={"/assets/occupancy.png"} />
                        </div>
                        <p className="ss_of">Occupancy Forecast</p>
                    </button>
                    <div className="clearFloat"></div>
                </div>              
            </div>
        )
    }
}

export {ServiceSelector}