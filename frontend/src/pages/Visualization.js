import React, { useEffect, useState } from "react";
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell, Treemap 
} from "recharts";
import Sidebar from "../components/sidebar/Sidebar";
import axios from "axios";

const Visualization = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/products") // Replace with actual API endpoint
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => console.error("Error fetching product data:", error));
    }, []);

    // Prepare Bar Chart Data (Price & Quantity)
    const barChartData = products.map((product) => ({
        name: product.name,
        price: product.price || 0,
        quantity: product.quantity || 0,
    }));

    // Corrected Pie Chart Data (Category Distribution)
    const pieChartData = products.reduce((acc, product) => {
        if (!product.category) return acc;

        const categoryIndex = acc.findIndex((item) => item.name === product.category);
        
        if (categoryIndex !== -1) {
            acc[categoryIndex].value += Number(product.quantity) || 0;  // Convert to number
        } else {
            acc.push({ name: product.category, value: Number(product.quantity) || 0 });
        }

        return acc;
    }, []);
    // Calculate total quantity for percentage calculation
const totalQuantity = pieChartData.reduce((sum, entry) => sum + entry.value, 0);

// Custom Label Function for Pie Chart
const renderCustomLabel = ({ name, value }) => {
    const percentage = ((value / totalQuantity) * 100).toFixed(1); // Keep 1 decimal place
    return `${name} (${percentage}%)`;
};

    // Prepare TreeMap Data (Stock Value)
    const treeMapData = products.map((product, index) => ({
        name: product.name,
        size: (product.price || 0) * (product.quantity || 0), // Stock Value = Price * Quantity
        fill: `hsl(${(index * 60) % 360}, 70%, 50%)`, // Generate different colors
    }));

    console.log("Pie Chart Data:", pieChartData);
    console.log("TreeMap Data:", treeMapData);

    // Colors for Pie Chart
    const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28AFE"];

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="content">
                <h2 className="text-center my-4">Product Visualization</h2>

                <div className="row">
                    {/* Bar Chart - Price & Quantity */}
                    <div className="col-md-6">
                        <h4 className="text-center">Price & Quantity</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barChartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="price" fill="#8884d8" />
                                <Bar dataKey="quantity" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart - Category Distribution */}
                    <div className="col-md-6">
                        <h4 className="text-center">Category Distribution</h4>
                        <ResponsiveContainer width="100%" height={300}>
    {pieChartData.length > 0 ? (
        <PieChart>
            <Pie 
                data={pieChartData} 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                label={renderCustomLabel} // Updated to show percentage
                dataKey="value"
            >
                {pieChartData.map((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    ) : (
        <p className="text-center">No category data available</p>
    )}
</ResponsiveContainer>
                    </div>
                </div>

                <div className="row mt-4">
                    {/* TreeMap - Stock Value Visualization */}
                    <div className="col-md-12">
                        <h4 className="text-center">Stock Value Distribution</h4>
                        <ResponsiveContainer width="100%" height={400}>
                            <Treemap
                                width={400}
                                height={400}
                                data={treeMapData}
                                dataKey="size"
                                aspectRatio={4 / 3}
                                stroke="#fff"
                                fill="#82ca9d"
                            >
                                <Tooltip
                                    content={({ payload }) => {
                                        if (!payload || payload.length === 0) return null;
                                        const { name, size } = payload[0].payload;
                                        return (
                                            <div style={{ background: "#fff", padding: "5px", border: "1px solid #ccc" }}>
                                                <p><strong>{name}</strong></p>
                                                <p>Stock Value: ₹{size}</p>
                                            </div>
                                        );
                                    }}
                                />
                            </Treemap>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Visualization;
