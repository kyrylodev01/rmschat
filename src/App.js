import RMSGraph from "./RMSGraph";
import "./App.css";
import { useState, useEffect, intervalRef } from "react";
import GraphSettings from "./GraphSettings";
import { Button } from "@mui/material";

function App() {
    const generateXY = (xa, xb, ya, yb) => {
        var xValue = [],
            yValue = [],
            colorValue = [];
        for (var i = xa; i <= xb; i += Math.floor(Math.random() * 10) / 10) {
            xValue.push(i);
            yValue.push(ya + Math.floor(Math.random() * (yb - ya)));

            colorValue.push(Math.floor(Math.random() * 3));
        }
        return [xValue, yValue, colorValue];
    };
    const values = generateXY(0, 100, 0, 100);
    const [numGraphs, setNumGraphs] = useState(1); // Default number of graphs is 10
    const graphArray = new Array(numGraphs).fill(null);
    const [chartData, setChartData] = useState({
        title: "RMS Chart",
        showTitle: true,
        depthRange: [-5, 10],
        nrmRange: [0, 7],
        inputData: {
            normRMS: 5,
            depth: values[0],
            rms: values[1],
            color_type: values[2],
        },
    });
    const updateInputData = (newData, graph) => {
        setChartData((prevChartData) => ({
            ...prevChartData,
            inputData: newData,
        }));
    };
    const fetchAndUpdateData = async () => {
        try {
            const response = await fetch("./RMSTestingData.json");
            if (!response.ok) {
                throw new Error(
                    "Failed to fetch data from RMSTestingData.json"
                );
            }
            const res = await response.json();
            console.log(res);
            const data = res[10];
            const { RMS, Depth, ColorType } = data;
            updateInputData({
                normRMS: 1,
                depth: [],
                rms: [],
                color_type: [],
            });

            // Helper function to simulate a delay
            const sleep = (milliseconds) => {
                return new Promise((resolve) =>
                    setTimeout(resolve, milliseconds)
                );
            };

            // Update inputData iteratively with a delay of 300 milliseconds
            for (let i = 1; i < Depth.length; i++) {
                await sleep(300);
                setChartData((prevChartData) => ({
                    ...prevChartData,
                    inputData: {
                        normRMS: 1,
                        depth: Depth.slice(0, i + 1),
                        rms: RMS.slice(0, i + 1),
                        color_type: ColorType.slice(0, i + 1),
                    },
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        // console.log(chartData.inputData);
    }, [chartData.inputData]);

    const handleButtonClick = () => {
        fetchAndUpdateData();
    };
    // Function to handle the drop-down value change
    const handleNumGraphsChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setNumGraphs(value);
    };

    // Create an array to hold the number of graphs to render
    // const randomize = () => {
    //     var i = Math.floor(Math.random() * 10);
    //     const nrmRange = Math.floor(Math.random() * 100);
    //     const newValue = generateXY(0, i, 0, nrmRange);

    //     setChartData({
    //         depthRange: [0, i],
    //         nrmRange: [0, nrmRange],
    //         inputData: {
    //             normRMS: Math.floor(Math.random() * 5),
    //             depth: newValue[0],
    //             rms: newValue[1],
    //             color_type: newValue[2],
    //         },
    //     });
    // };
    const [width, setWidth] = useState(500);
    const [height, setHeight] = useState(300);
    const [depthLabel, setDepthLabel] = useState("Depth [mm]");
    const [nrmsLabel, setNRMSLabel] = useState("NRMS");
    const [depthDisplay, setDepthDisplay] = useState(true);
    const [nrmsDisplay, setNrmsDisplay] = useState(true);
    const [gridDisplay, setGridDisplay] = useState("ON");
    const [chartDirection, setChartDirection] = useState("vertical");
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleBackgroundCallBack = (display) => {
        setIsDarkMode(display);
    };
    const handleToggleTheme = (display) => {
        setIsDarkMode(display);
    };

    const theme = {
        barColors: isDarkMode
            ? ["white", "darkblue", "#333333", "darkred"]
            : ["black", "blue", "#cccccc", "red"],
        backgroundColor: isDarkMode ? "#333333" : "#ffffff",
    };
    const handleTitleChange = (newTitle) => {
        setChartData((prevChartData) => ({
            ...prevChartData,
            title: newTitle,
        }));
    };
    const handleTitleVisibilityToggle = () => {
        setChartData((prevChartData) => ({
            ...prevChartData,
            showTitle: !prevChartData.showTitle,
        }));
    };
    const handleDepthRangeChange = (newDepthRange) => {
        setChartData((prevChartData) => ({
            ...prevChartData,
            depthRange: newDepthRange,
        }));
    };

    const handleNrmRangeChange = (newNrmRange) => {
        setChartData((prevChartData) => ({
            ...prevChartData,
            nrmRange: newNrmRange,
        }));
    };
    const handleWidthChange = (newWidth) => {
        setWidth(newWidth);
    };
    const handleHeightChange = (newWidth) => {
        setHeight(newWidth);
    };
    const handleDepthLabelChange = (newLabel) => {
        // console.log(newLabel);
        setDepthLabel(newLabel);
    };
    const handleNRMSLabelChange = (newLabel) => {
        setNRMSLabel(newLabel);
    };
    const handleDepthLabelDisplay = (display) => {
        // console.log(display);
        setDepthDisplay(display);
    };
    const handleNRMSLabelDisplay = (display) => {
        setNrmsDisplay(display);
    };
    const handleGridDisplayChange = (newGridDisplay) => {
        setGridDisplay(newGridDisplay);
    };
    const handleGraphDirection = (newDirection) => {
        setChartDirection(newDirection);
    };
    const backgroundHandler = () => {
        console.log('Background Color Change Handler');
    }
    return (
        <>
        
            <GraphSettings
                isDarkMode={isDarkMode}
                title={chartData.title}
                width={width}
                height={height}
                depthLabel={depthLabel}
                nrmsLabel={nrmsLabel}
                titleDisplay={chartData.showTitle}
                depthDisplay={depthDisplay}
                nrmsDisplay={nrmsDisplay}
                gridDisplay={gridDisplay}
                chartDirection={chartDirection}
                depthRange={chartData.depthRange}
                nrmsRange={chartData.nrmRange}
                onSetDarkMode={handleToggleTheme}
                onChangeTitle={handleTitleChange}
                onDisplayTitle={handleTitleVisibilityToggle}
                onChangeDepthRange={handleDepthRangeChange}
                onChangeNrmsRange={handleNrmRangeChange}
                onSetGraphDirection={handleGraphDirection}
                onChangeWidth={handleWidthChange}
                onChangeHeight={handleHeightChange}
                onChangeDepthLabel={handleDepthLabelChange}
                onChangeNRMSLabel={handleNRMSLabelChange}
                onDisplayDepth={handleDepthLabelDisplay}
                onDisplayNrms={handleNRMSLabelDisplay}
                onDisplayGrid={handleGridDisplayChange}
            />
            <div style={{ display: "flex" }}>
                {" "}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleButtonClick}
                >
                    Update Data
                </Button>
                {/* Drop-down button to select the number of graphs */}
                <label
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "30px",
                        fontSize: "16px",
                        color: "#1976D2", // Text color
                        fontWeight: "bold",
                    }}
                >
                    Select the number of graphs:
                    <select
                        style={{
                            padding: "8px",
                            fontSize: "16px",
                            borderRadius: "6px",
                            border: "1px solid #1976D2", // Border color
                            backgroundColor: "#FFFFFF", // Background color for the select element
                            color: "#1976D2", // Text color
                            outline: "none", // Remove default focus border
                            cursor: "pointer",
                        }}
                        value={numGraphs}
                        onChange={handleNumGraphsChange}
                    >
                        {Array.from(
                            { length: 10 },
                            (_, index) => index + 1
                        ).map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr", // Two columns
                    gridGap: "10px", // Gap between grid items
                }}
            >
                {/* Render RMSGraph components based on the selected number */}
                {graphArray.map((_, index) => (
                    <RMSGraph
                        key={index}
                        index={`Left_RMS_${index}`}
                        title={chartData.title}
                        showTitle={chartData.showTitle}
                        width={width}
                        height={height}
                        depthAxisLabel={depthLabel}
                        showDepthAxisLabel={depthDisplay}
                        NRMSAxisLabel={nrmsLabel}
                        showNRMSAxisLabel={nrmsDisplay}
                        axisDirection={chartDirection}
                        depthRange={chartData.depthRange}
                        nrmsRange={chartData.nrmRange}
                        grid={gridDisplay}
                        inputData={{
                            normRMS: 10,
                            depth: chartData.inputData.depth, // Accessing depth data using the index
                            rms: chartData.inputData.rms, // Accessing rms data using the index
                            color_type: chartData.inputData.color_type, // Accessing color_type data using the index
                        }}
                        barColors={theme.barColors}
                        backgroundColor={theme.backgroundColor}
                        backgroundHandler={backgroundHandler}
                    />
                ))}
            </div>
            <RMSGraph
                title="RMS Chart"
                width="500px"
                height="300px"
                depthAxisLabel="Depth [mm]"
                showDepthAxisLabel={true}
                NRMSAxisLabel="NRMS"
                showNRMSAxisLabel={true}
                axisDirection="Vertical"
                //axisDirection='vertical'
                depthRange={chartData.depthRange}
                nrmsRange={chartData.nrmRange}
                grid="ON"
                inputData={{
                    normRMS: 10,
                    depth: chartData.inputData.depth,
                    rms: chartData.inputData.rms,
                    color_type: chartData.inputData.color_type,
                }}
                //regular, normal, ignore, high
                barColors={["black", "blue", "#cccccc", "red"]}
                backgroundColor="#ffffff"
                backgroundHandler={backgroundHandler}
            ></RMSGraph>
        </>
    );
}

export default App;
