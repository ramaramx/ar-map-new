import {MapContainer, Marker, TileLayer} from "react-leaflet";
import {useState} from "react";
import mapConfig from './json/map_setting.json'
import categories from './json/categories.json'
import items from './json/map_marker.json'
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import L from 'leaflet';
import {Button, Checkbox, Col, Row} from "antd";

const App = () => {
    const [category, setCategory] = useState<string[]>([])
    const [triger, setTriger] = useState(1)
    const isAndroid = () => /Android/i.test(navigator.userAgent);
    const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);


    const handleAddCategory = (cat: string) => {
        setCategory((prevCategory) => {
            if (prevCategory.includes(cat)) {
                // If the category exists, remove it
                return prevCategory.filter((item) => item !== cat);
            } else {
                // If the category doesn't exist, add it
                return [...prevCategory, cat];
            }
        });
        setTriger(triger + 1)
    };



    const filteredItems = category.length > 0 ? items.filter(item => category.includes(item.category)) : items;


    return (
        <div style={{overflowX: "hidden"}}>
            <MapContainer
                //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                center={mapConfig.center}
                minZoom={mapConfig.minZoom}
                maxZoom={mapConfig.maxZoom}
                zoom={mapConfig.zoom}
                dragging={mapConfig.dragging}
                scrollWheelZoom={mapConfig.scrollWheelZoom}
                zoomControl={mapConfig.zoomControl}
                style={mapConfig.style}
            >
                <TileLayer
                    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredItems.map((item, index) =>
                    <Marker
                        eventHandlers={{
                            click: () => window.open(`#${item.id}`, '_self')
                        }}
                        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        icon={
                            new L.Icon({
                                iconUrl: categories.find(category => category.name === item.category)?.icon,
                                iconSize: [32, 32],
                                iconAnchor: [16, 32],
                                popupAnchor: [0, -32],
                            })} key={index} position={[item.position.lat, item.position.lon]}/>
                )}
            </MapContainer>
            <div className="category-list"
                 style={{
                     position: "absolute",
                     zIndex: 999,
                     top: 16,
                     right: 16,
                     background: "white",
                     padding: 16,
                     borderRadius: 8
                 }}>
                {categories.map((item, index) => <div key={index}><Checkbox
                    onChange={() => handleAddCategory(item.name)}
                    key={index}>{item.name}</Checkbox></div>)}
            </div>
            {triger &&
                <div className="data-list">
                    <h2>Übersicht Touren</h2>
                    <div className="content">
                        {filteredItems.map((item, index) => <div key={index}>
                            <Row gutter={[26, 26]} align={"middle"} style={{marginBottom: 16}} id={item.id}>
                                <Col>
                                    <img  
                                         src={item.imageUrl} style={{maxWidth:'100%'}} alt=""/>
                                </Col>
                                <Col>
                                    <div>
				     <div className="category">
                                            <h4>{item.category}</h4>
                                        </div>
                                        <div className="title">
                                            <h3 id={'map-title-' + item.id} style={{
                                                margin: 0,
                                                marginBottom: '1rem',
                                            }}>{item.title}</h3>
                                        </div>

					<div className="description">
                                            {item.description}
                                        </div>

                                        <div className="category" style={{marginBottom: 16}}>
                                            <Button onClick={() => {
                                                if (isAndroid()) {
                                                    window.open(`google.navigation:q=(${item.position.lat} , ${item.position.lon})`)
                                                } else if (isIOS()) {
                                                    window.open(`https://maps.apple.com/?q=(${item.position.lat} , ${item.position.lon})`)
                                                } else {
                                                window.open(`https://www.google.com/maps/@${item.position.lat} , ${item.position.lon}`)
                                                }
                                            }} size={"small"} color="default" variant="outlined">
                                                zur Routenführung
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                        </div>)}
                    </div>
                </div>
            }
        </div>
    );
};

export default App;