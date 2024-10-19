
import { Icon, Input, TextField } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import '../style/General.css';

// Stil tablosu komponenti
const StyledTable = React.forwardRef(({ selectedElement, onStyleChange }, props) => {
    const [styles, setStyles] = useState({});
    const [attributes, setAttributes] = useState({});

    useEffect(() => {
        if (selectedElement) {
            const computedStyles = window.getComputedStyle(selectedElement);
            const styleObj = {
                backgroundColor: computedStyles.backgroundColor,
                width: computedStyles.width,
                height: computedStyles.height,
                left: computedStyles.left,
                top: computedStyles.top,
                textAlign: computedStyles.textAlign,
                color: computedStyles.color,
                margin: computedStyles.margin,
                padding: computedStyles.padding,
                position: computedStyles.position,
                display: computedStyles.display,
                border: computedStyles.border,
                zIndex: computedStyles.zIndex,
                font: computedStyles.font,
                fontWeight: computedStyles.fontWeight,
                textAlign: computedStyles.textAlign,
                textDecoration: computedStyles.textDecoration,
                borderRadius: computedStyles.borderRadius,
            };
            const attrs = selectedElement.attributes;
            const attrObj = {};
            for (let i = 0; i < attrs.length; i++) {
                attrObj[attrs[i].name] = attrs[i].value;
            }
            setAttributes(attrObj);
            setStyles(styleObj);
        }
    }, [selectedElement]);


    const handleAttributeChange = (name, value) => {
        setAttributes((prev) => ({ ...prev, [name]: value }));
    };

    const handleChange = (e) => {
        applyStyle(e.target.name, e.target.value);
    };
    const applyStyle = (name, value) => {
        const updatedStyles = { ...styles, [name]: value };
        //styles[name] = value;
        setStyles(updatedStyles);
        onStyleChange(name, value);
    }

    const handleColorChange = (e) => {
        selectedElement.style[e.target.name] = e.target.value;
        styles[e.target.name] = e.target.value;
        applyStyle(e.target.name, e.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            console.log("Entered");
        }
    };
    const PropertyValue = (style) => {

        if (style.toLowerCase().endsWith("color")) {
            return (<input type="color" id={style + "-" + Math.floor(Math.random() * 10000)} name={style} value={rgbx2Hex(styles[style])} onChange={handleColorChange}
                style={{
                    width: '20px',   // Genişliği ayarla
                    height: '20px',  // Yüksekliği ayarla
                    border: 'none',   // Kenar çizgisini kaldır
                    padding: '0',     // İç boşluğu kaldır
                    cursor: 'pointer', // Fare imleci değişikliği
                    appearance: 'none', // Varsayılan görünümü kaldır
                }} />);
        } else {
            return (<input
                id={style + "-" + Math.floor(Math.random() * 10000)}
                style={{ fontSize: "8pt", width: "100%" }}
                type="text"
                name={style}
                value={styles[style]}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />);
        }
    };

    const hex2Rgb = (hex) => {
        // Hex kodu doğrulama
        const regex = /^#([0-9A-Fa-f]{3}){1,2}$/;
        if (!regex.test(hex)) {
            throw new Error("Geçersiz hex kodu");
        }

        let r, g, b;

        // 3 veya 6 karakterli hex kodu
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }

        return `rgb(${r}, ${g}, ${b})`;
    };

    const rgbx2Hex = (rgbx) => {
        if (!rgbx.startsWith("rgb"))
            return rgbx;

        if (rgbx.startsWith("rgba"))
            return rgba2Hex(rgbx);

        return rgb2Hex(rgbx);
    };

    // RGB formatından Hexadecimal formata çeviren fonksiyon
    const rgb2Hex = (rgb) => {
        // rgb string'ini ayrıştır
        const regex = /rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/;
        const match = rgb.match(regex);

        if (!match) {
            throw new Error("Geçersiz RGB formatı. Doğru format: rgb(r, g, b)");
        }

        // Ayrıştırılan değerleri al
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);

        // Renk değerlerinin geçerliliğini kontrol et
        if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
            throw new Error("Renk değerleri 0-255 arasında olmalıdır");
        }

        const hexR = r.toString(16).padStart(2, '0');
        const hexG = g.toString(16).padStart(2, '0');
        const hexB = b.toString(16).padStart(2, '0');

        return `#${hexR}${hexG}${hexB}`;
    };

    const hex2Rgba = (hex) => {
        // HEX formatını temizle
        let r = 0, g = 0, b = 0;
        // HEX formatı #RRGGBB veya #RGB şeklinde olabilir
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        return `rgba(${r}, ${g}, ${b}, 1)`; // Alpha kanalı 1 (tam opak)
    };
    const rgba2Hex = (rgba) => {
        // rgba string'ini ayrıştır
        const regex = /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\s*\)/;
        const match = rgba.match(regex);

        if (!match) {
            throw new Error("Geçersiz RGBA formatı. Doğru format: rgba(r, g, b, a)");
        }

        // Ayrıştırılan değerleri al
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        const a = match[4] !== undefined ? parseFloat(match[4]) : 1; // Alpha değeri varsayılan 1 (opak)

        // Renk değerlerinin geçerliliğini kontrol et
        if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 || a < 0 || a > 1) {
            throw new Error("Renk değerleri 0-255 arasında, alpha değeri 0-1 arasında olmalıdır");
        }

        const hexR = r.toString(16).padStart(2, '0');
        const hexG = g.toString(16).padStart(2, '0');
        const hexB = b.toString(16).padStart(2, '0');

        // Alpha değerini hex formatına dönüştür (0-255 arası)
        const hexA = Math.round(a * 255).toString(16).padStart(2, '0');

        return `#${hexR}${hexG}${hexB}${hexA}`; // Alpha ile birlikte döner
    };
    return (
        <Draggable
            handle=".drag-handle"
        >
            <div className='draggableContent' style={{ fontSize: '8pt', textAlign: 'left', zIndex: 999999, backgroundColor: 'white' }}>
                <Icon fontSize="small" color="inherit"
                    className="drag-handle"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: -28,
                        cursor: "move",
                        backgroundColor: "white",
                        border: 'solid 1px lightgray',
                        borderRadius: '3px',
                        width: "24px",
                        height: "24px",
                    }}>
                    drag_handle
                </Icon>
                <table style={{ width: "100%" }}>
                    <caption className='propertiesPanel'><h2>Properties Panel</h2></caption>
                    <tbody>
                        <tr>
                            <td>
                                <h4>Style List</h4>
                                <hr />
                            </td>
                        </tr>
                        {Object.keys(styles).map((style) => (
                            <tr key={style}>
                                <td>
                                    <div><b>{style}</b></div>
                                    {PropertyValue(style)}
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td className='propertiesPanel'>
                                <h2>Attributes</h2>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h4>Attribute List</h4>
                                <hr />
                            </td>
                        </tr>
                        {Object.entries(attributes).map(([key, value]) => (
                            <tr key={key}>
                                <td>
                                    <div><b>{key}</b></div>
                                    <input
                                        id={key + "-" + Math.floor(Math.random() * 10000)}
                                        style={{ fontSize: "8pt", width: "100%" }}
                                        type="text"
                                        value={value}
                                        label={key}
                                        onChange={(e) => handleAttributeChange(key, e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >
        </Draggable>
    );
});
export default StyledTable;