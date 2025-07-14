# 🔍 Debugging Console Log Guide for Demo Account Testing

## **What Console Logs You Should See**

I've added comprehensive logging to track what's happening in your client dashboard. Here's what you should expect to see when testing with `demo@onbarnai.com`:

---

## **1. Initial Dashboard Load**

When you first login and the dashboard loads, you should see:

```
🔍 [RoleBasedDashboard] COMPONENT RENDERED
🔍 [RoleBasedDashboard] User: {email: "demo@onbarnai.com", ...}
🔍 [RoleBasedDashboard] User Email: demo@onbarnai.com
🔍 [RoleBasedDashboard] User Role: client
🔍 [RoleBasedDashboard] TenantId: [tenant-id]
🔍 [RoleBasedDashboard] Horses: [array of horse data]
🔍 [RoleBasedDashboard] Cameras: [array of camera data]
🔍 [RoleBasedDashboard] Insights: [array of insights]
🔍 [RoleBasedDashboard] Alerts: [array of alerts]
🔍 [RoleBasedDashboard] Current activeTab: overview
🔍 [RoleBasedDashboard] selectedCamera: null
🔍 [RoleBasedDashboard] systemStatus: {...}
```

---

## **2. AI Guardian Section Load**

When the AI Guardian section renders, you should see:

```
🔍 [AIInsightsPanel] COMPONENT RENDERED
🔍 [AIInsightsPanel] User: {email: "demo@onbarnai.com", ...}
🔍 [AIInsightsPanel] User Email: demo@onbarnai.com
🔍 [AIInsightsPanel] IsDemoAccount: true
🔍 [AIInsightsPanel] Insights: [array of insights]
🔍 [AIInsightsPanel] Alerts: [array of alerts - Star, Thunder, etc.]
🔍 [AIInsightsPanel] Horses: [array of horse data]
🔍 [AIInsightsPanel] ActiveTab: alerts
🔍 [AIInsightsPanel] CameraConnected: false
🔍 [AIInsightsPanel] IsStreamActive: false
```

---

## **3. When You Click "Connect Camera" (AI Guardian Tab)**

If you see the "🎥 Connect Camera" tab in the AI Guardian section and click it:

```
🔍 [AIInsightsPanel] Camera button clicked
🔍 [AIInsightsPanel] cameraConnected: false
🔍 [AIInsightsPanel] activeTab: alerts
🔍 [AIInsightsPanel] Calling handleCameraConnection
🎬 [AIInsightsPanel] handleCameraConnection called
🎬 [AIInsightsPanel] isDemoAccount: true
🎬 [AIInsightsPanel] Starting camera connection for AI monitoring...
🎬 [AIInsightsPanel] Stream obtained: [MediaStream object]
```

---

## **4. When You Click "Connect Camera" (Main Dashboard)**

If you see the main "Connect Camera" button with "Click to use your camera" text:

```
🔍 [LiveVideoGrid] Connect Camera button clicked
🔍 [LiveVideoGrid] selectedCamera: [camera-id]
🔍 [LiveVideoGrid] userEmail: demo@onbarnai.com
🔍 [LiveVideoGrid] About to call handleCameraConnection
🎬 [LiveVideoGrid] handleCameraConnection called
🎬 [LiveVideoGrid] cameraId: [camera-id]
🎬 [LiveVideoGrid] userEmail: demo@onbarnai.com
🎬 [LiveVideoGrid] isDemoAccount: true
🎬 [LiveVideoGrid] Starting camera connection for AI monitoring...
🎬 [LiveVideoGrid] Stream obtained: [MediaStream object]
```

---

## **5. When AI Monitor Component Renders**

If the ScheduledAIMonitor component is being used:

```
🔍 [ScheduledAIMonitor] COMPONENT RENDERED
🔍 [ScheduledAIMonitor] videoRef: [RefObject]
🔍 [ScheduledAIMonitor] isStreamActive: true/false
🔍 [ScheduledAIMonitor] onAnalysisComplete: [function]
```

---

## **What to Report Back to Me**

### **✅ What's Working**
- Which console logs you DO see
- Which components are rendering correctly
- Any successful camera connections

### **❌ What's Missing**
- Which console logs you DON'T see
- Which components are NOT rendering
- Any errors in the console

### **🔍 Key Questions to Answer**
1. **Do you see the `🔍 [RoleBasedDashboard] COMPONENT RENDERED` log?**
2. **Do you see the `🔍 [AIInsightsPanel] COMPONENT RENDERED` log?**
3. **Is `IsDemoAccount: true` in the AIInsightsPanel logs?**
4. **Do you see any "Connect Camera" button clicks in the logs?**
5. **Are there any error messages in the console?**

---

## **Expected Flow Summary**

1. **Dashboard loads** → RoleBasedDashboard logs appear
2. **AI Guardian section loads** → AIInsightsPanel logs appear  
3. **Camera button appears** → Either in AI Guardian tab or main dashboard
4. **Click camera button** → Connection logs appear
5. **AI Monitor activates** → ScheduledAIMonitor logs appear

---

## **Common Issues to Check**

### **If NO logs appear:**
- Check if JavaScript console is open (F12)
- Verify you're logged in as `demo@onbarnai.com`
- Make sure the page fully loaded

### **If components don't render:**
- Look for React/TypeScript errors in console
- Check if the user role is correctly set to "client"
- Verify authentication is working

### **If camera button doesn't work:**
- Check if `IsDemoAccount: true` appears in logs
- Look for browser permission dialogs
- Check for WebRTC/camera access errors

---

## **Next Steps**

After you test and provide me with the console logs, I'll be able to:
1. **Identify exactly where the AI monitoring system is failing**
2. **Fix the integration issues** 
3. **Ensure the camera connection triggers the AI analysis**
4. **Get the scheduled photo capture working correctly**

**Please copy and paste the console logs you see when testing, especially any that don't match what's expected above.** 