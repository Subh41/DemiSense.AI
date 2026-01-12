import { useEffect, useState } from "react";

const NotificationComponent = ({ medicalLicenseNumber }) => {
  const [notifications, setNotifications] = useState([]);
  const [, setSocket] = useState(null);

  useEffect(() => {
    if (!medicalLicenseNumber) return;

    // Establish WebSocket connection
    const ws = new WebSocket(`ws://localhost:9000/${medicalLicenseNumber}`);

    ws.onopen = () => {
      console.log("WebSocket connected ✅");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]); // Add new notifications
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.log("WebSocket disconnected ❌");

    return () => {
      ws.close(); // Cleanup on unmount
    };
  }, [medicalLicenseNumber]);

  return (
    <div>
      <h3>🔔 Notifications</h3>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{notif.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponent;
