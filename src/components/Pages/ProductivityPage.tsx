import { useEffect, useState } from "react";
import { getTasks } from "../../api/taskApi";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import "../Pages/ProductivtyPage.css";
import { CategoryScale } from "chart.js"; 

Chart.register(CategoryScale);
const ProductivityPage = () => {
  const [, setTasks] = useState<{ _id: string; title: string; date?: string; status?: string }[]>([]);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  const [completedTasks, setCompletedTasks] = useState<number>(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log("Fetching tasks...");
        const fetchedTasks = await getTasks();
        console.log("Fetched tasks:", fetchedTasks);
  
        if (!Array.isArray(fetchedTasks)) {
          console.error("Error: API did not return an array", fetchedTasks);
          return;
        }
  
        setTasks(fetchedTasks); 
console.log("Updated tasks state:", fetchedTasks);  // Corrected from setTodos to setTasks
        processData(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);
  
  

  const processData = (tasks: { _id: string; title: string; date?: string; status?: string }[]) => {
    const today = new Date();
    const weekDates = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date.toISOString().split("T")[0];
    });

    const monthDates = [...Array(30)].map((_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date.toISOString().split("T")[0];
    });

    const weeklyCount = weekDates.map(date =>
      tasks.filter(task => task.date === date && task.status === "Completed").length
    );

    const monthlyCount = monthDates.map(date =>
      tasks.filter(task => task.date === date && task.status === "Completed").length
    );

    setCompletedTasks(tasks.filter(task => task.status === "Completed").length);
    setWeeklyData(weeklyCount.reverse());
    setMonthlyData(monthlyCount.reverse());
  };

  const weeklyChartData = {
    labels: ["6 Days Ago", "5 Days Ago", "4 Days Ago", "3 Days Ago", "2 Days Ago", "Yesterday", "Today"],
    datasets: [
      {
        label: "Tasks Completed This Week",
        data: weeklyData,
        borderColor: "#4CAF50",
        fill: false,
      },
    ],
  };

  const monthlyChartData = {
    labels: ["30 Days Ago", "20 Days Ago", "10 Days Ago", "Yesterday", "Today"],
    datasets: [
      {
        label: "Tasks Completed This Month",
        data: monthlyData.filter((_, index) => index % 5 === 0 || index === monthlyData.length - 1),
        borderColor: "#3E95CD",
        fill: false,
      },
    ],
  };

  return (
    <div className="productivity-container">
      <header className="header">
        <h1>Productivity Status</h1>
      </header>
  
      <div className="summary">
        <h2>Completed Tasks: {completedTasks}</h2>
      </div>
  
      <div className="chart-container">
        <div className="chart">
          <h3>Weekly Productivity</h3>
          {weeklyData.length > 0 ? <Line data={weeklyChartData} /> : <p>No data available</p>}
        </div>
        <div className="chart">
          <h3>Monthly Productivity</h3>
          {monthlyData.length > 0 ? <Line data={monthlyChartData} /> : <p>No data available</p>}
        </div>
      </div>
    </div>
  );
}  

export default ProductivityPage;

