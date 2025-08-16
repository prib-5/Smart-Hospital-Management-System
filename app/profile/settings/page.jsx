
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3">
          <Settings className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl text-primary">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Notification Preferences</h3>
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates and reminders via email.</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <Label htmlFor="sms-notifications" className="font-medium">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Get important alerts via SMS.</p>
              </div>
              <Switch id="sms-notifications" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Account Settings</h3>
            <Button variant="outline">Change Password</Button>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
