import { Box, FormControlLabel, Slider, Switch } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";

const GraphSettings = ({
    onChangeTitle,
    onChangeWidth,
    onChangeHeight,
    onChangeDepthLabel,
    onChangeNRMSLabel,
    onDisplayTitle,
    onDisplayDepth,
    onDisplayNrms,
    onDisplayGrid,
    onSetGraphDirection,
    onChangeDepthRange,
    onChangeNrmsRange,
    onSetDarkMode,
    isDarkMode,
    title,
    width,
    height,
    depthLabel,
    nrmsLabel,
    titleDisplay,
    depthDisplay,
    nrmsDisplay,
    gridDisplay,
    chartDirection,
    depthRange,
    nrmsRange,
}) => {
    const [graphTitle, setGraphTitle] = useState(title);
    const [showTitle, setShowTitle] = useState(titleDisplay);
    const [graphWidth, setGraphWidth] = useState(width);
    const [graphHeight, setGraphHeight] = useState(height);
    const [depthAxisLabel, setDepthAxisLabel] = useState(depthLabel);
    const [nrmsAxisLabel, setnrmsAxisLabel] = useState(nrmsLabel);
    const [displayDepth, setDisplayDepth] = useState(depthDisplay);
    const [displayNrms, setDisplayNrms] = useState(nrmsDisplay);
    const [depthAxisRange, setDepthAxisRange] = useState(depthRange);
    const [nrmsAxisRange, setNrmsAxisRange] = useState(nrmsRange);
    const [gridGraphDisplay, setGridGraphDisplay] = useState(gridDisplay);
    const [graphDirection, setGraphDirection] = useState(chartDirection);
    const [darkMode, setDarkMode] = useState(false);

    const handleToggleTheme = (event) => {
        const newTheme = event.target.checked;
        setDarkMode(newTheme);
        onSetDarkMode(newTheme);
    };

    const handleTitleChange = (event) => {
        const newTitle = event.target.value;
        setGraphTitle(newTitle);
        onChangeTitle(newTitle);
    };
    const handleTitleDisplay = (event) => {
        const display = event.target.checked;
        setShowTitle(display);
        onDisplayTitle(display);
    };
    const handleWidthChange = (event, newValue) => {
        const newWidth = parseInt(newValue, 10); // Parse the value as a number
        setGraphWidth(newWidth);
        onChangeWidth(newWidth);
        // console.log(newWidth);
    };
    const handleHeightChange = (event, newValue) => {
        const newHeight = parseInt(newValue, 10); // Parse the value as a number
        setGraphHeight(newHeight);
        onChangeHeight(newHeight);
        // console.log(newHeight);
    };
    const handleDepthLabelChange = (event) => {
        const newDepthLabel = event.target.value;
        setDepthAxisLabel(newDepthLabel);
        onChangeDepthLabel(newDepthLabel);
    };
    const handleNRMSLabelChange = (event) => {
        const newNRMSLabel = event.target.value;
        setnrmsAxisLabel(newNRMSLabel);
        onChangeNRMSLabel(newNRMSLabel);
    };
    const handleDepthLabelDisplay = (event) => {
        const display = event.target.checked;
        setDisplayDepth(display);
        onDisplayDepth(display);
    };
    const handleNrmsLabelDisplay = (event) => {
        const display = event.target.checked;
        setDisplayNrms(display);
        onDisplayNrms(display);
    };
    const handleGridDisplayChange = (event) => {
        const display = event.target.checked ? "ON" : "OFF";
        setGridGraphDisplay(display);
        onDisplayGrid(display);
    };
    const handleGraphDirectionChange = (event) => {
        const newDirection = event.target.checked ? "Horizontal" : "Vertical";
        setGraphDirection(newDirection);
        onSetGraphDirection(newDirection);
    };
    const handleDepthRangeChange = (event, newRange) => {
        setDepthAxisRange(newRange);
        onChangeDepthRange(newRange);
    };
    const handleNrmsRangeChange = (event, newRange) => {
        setNrmsAxisRange(newRange);
        onChangeNrmsRange(newRange);
    };
    const valuetext = (value) => {
        return `${value}`;
    };
    function generateMarks(min, max, segments) {
        const range = max - min;
        const segmentSize = range / segments;

        const marks = [];

        for (let i = 0; i <= segments; i++) {
            const value = min + segmentSize * i;
            marks.push({ value, label: String(value) });
        }

        return marks;
    }
    const widthSliderMarks = generateMarks(0, 2000, 10);
    const heightSliderMarks = generateMarks(0, 1000, 10);
    const depthRangeMarks = generateMarks(-20, 20, 8);
    const nrmsRangeMarks = generateMarks(0, 10, 5);
    const MaterialUISwitch = styled(Switch)(({ theme }) => ({
        width: 62,
        height: 34,
        padding: 7,
        "& .MuiSwitch-switchBase": {
            margin: 1,
            padding: 0,
            transform: "translateX(6px)",
            "&.Mui-checked": {
                color: "#fff",
                transform: "translateX(22px)",
                "& .MuiSwitch-thumb:before": {
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                        "#fff"
                    )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
                },
                "& + .MuiSwitch-track": {
                    opacity: 1,
                    backgroundColor:
                        theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
                },
            },
        },
        "& .MuiSwitch-thumb": {
            backgroundColor:
                theme.palette.mode === "dark" ? "#003892" : "#001e3c",
            width: 32,
            height: 32,
            "&:before": {
                content: "''",
                position: "absolute",
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    "#fff"
                )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
            },
        },
        "& .MuiSwitch-track": {
            opacity: 1,
            backgroundColor:
                theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
            borderRadius: 20 / 2,
        },
    }));
    return (
        <>
            <FormControlLabel
                control={
                    <MaterialUISwitch
                        sx={{ m: 1 }}
                        checked={isDarkMode}
                        onChange={handleToggleTheme}
                    />
                }
                label="Change Graph Colors"
            />

            <div
                className="flex-box"
                style={{ display: "flex", marginBottom: "20px" }}
            >
                <div id="title-change">
                    <label>
                        Title :{" "}
                        <input
                            type="text"
                            value={graphTitle}
                            onChange={handleTitleChange}
                        />
                    </label>
                </div>
                <Box
                    style={{
                        marginLeft: "20px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <FormControlLabel
                        style={{ marginLeft: "10px" }}
                        control={
                            <Switch
                                checked={showTitle}
                                onChange={handleTitleDisplay}
                            />
                        }
                        label="Display Graph Title"
                    />
                    <FormControlLabel
                        style={{ marginLeft: "10px" }}
                        control={
                            <Switch
                                checked={displayDepth}
                                onChange={handleDepthLabelDisplay}
                                // defaultChecked
                            />
                        }
                        label="Display Depth Label"
                    />
                    <FormControlLabel
                        style={{ marginLeft: "10px" }}
                        control={
                            <Switch
                                checked={displayNrms}
                                onChange={handleNrmsLabelDisplay}
                                // defaultChecked
                            />
                        }
                        label="Display NRMS Label"
                    />
                    <FormControlLabel
                        style={{ marginLeft: "10px" }}
                        control={
                            <Switch
                                checked={gridGraphDisplay === "ON"}
                                onChange={handleGridDisplayChange}
                            />
                        }
                        label={"Display graph Grid"}
                    />
                    <FormControlLabel
                        style={{ marginLeft: "10px" }}
                        control={
                            <Switch
                                checked={graphDirection === "Horizontal"}
                                onChange={handleGraphDirectionChange}
                            />
                        }
                        label={graphDirection ? "Horizontal" : "Vertical"}
                    />
                </Box>
                <Box
                    style={{
                        marginLeft: "20px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div id="depth-label-change">
                        <label>
                            Depth Label :{" "}
                            <input
                                type="text"
                                value={depthAxisLabel}
                                onChange={handleDepthLabelChange}
                            />
                        </label>
                    </div>
                    <div id="nrms-label-change">
                        <label>
                            NRMS Label :{" "}
                            <input
                                type="text"
                                value={nrmsAxisLabel}
                                onChange={handleNRMSLabelChange}
                            />
                        </label>
                    </div>
                </Box>
            </div>
            <Box
                id="width-change"
                style={{
                    marginLeft: "20px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                Change Width
                <Slider
                    aria-label="Always visible"
                    value={graphWidth}
                    getAriaValueText={valuetext}
                    step={10}
                    max={2000}
                    marks={widthSliderMarks}
                    valueLabelDisplay="on"
                    onChange={handleWidthChange}
                    style={{ width: "80%" }}
                />
            </Box>
            <Box
                id="height-change"
                style={{
                    marginLeft: "20px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                Change Height
                <Slider
                    aria-label="Always visible"
                    value={graphHeight}
                    getAriaValueText={valuetext}
                    step={10}
                    max={1000}
                    marks={heightSliderMarks}
                    valueLabelDisplay="on"
                    onChange={handleHeightChange}
                    style={{
                        width: "40%",
                    }}
                />
            </Box>
            <Box
                id="axis-range-change"
                style={{
                    marginLeft: "20px",
                    display: "flex",
                }}
            >
                <Box
                    id="height-change"
                    style={{
                        marginLeft: "20px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    Change Depth Range
                    <Slider
                        getAriaLabel={() => "Depth range"}
                        value={depthAxisRange}
                        max={20}
                        min={-20}
                        onChange={handleDepthRangeChange}
                        marks={depthRangeMarks}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                    />
                </Box>
                <Box
                    id="height-change"
                    style={{
                        marginLeft: "50px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    Change NRMS Range
                    <Slider
                        getAriaLabel={() => "NRMS range"}
                        value={nrmsAxisRange}
                        max={10}
                        onChange={handleNrmsRangeChange}
                        marks={nrmsRangeMarks}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                    />
                </Box>
            </Box>
        </>
    );
};

export default GraphSettings;
