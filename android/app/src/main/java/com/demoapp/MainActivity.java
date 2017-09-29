package com.demoapp;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    public static final int PERMISSION_REQ_CODE = 1234;
    public static final int OVERLAY_PERMISSION_REQ_CODE = 1235;
    String[] perms = {
            "android.permission.ACCESS_FINE_LOCATION",
            "android.permission.ACCESS_COARSE_LOCATION"
    };

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "DemoApp";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        checkPerms();
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    public void checkPerms() {
        // Checking if device version > 22 and we need to use new permission model
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.LOLLIPOP_MR1) {
            // Checking if we can draw window overlay
            if (!Settings.canDrawOverlays(this)) {
                // Requesting permission for window overlay(needed for all react-native apps)
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getPackageName()));
                startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
            }
            for (String perm : perms) {
                // Checking each persmission and if denied then requesting permissions
                if (checkSelfPermission(perm) == PackageManager.PERMISSION_DENIED) {
                    requestPermissions(perms, PERMISSION_REQ_CODE);
                    break;
                }
            }
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
        if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
            checkPerms();
        }
    }

    // Permission results
    @Override
    public void onRequestPermissionsResult(int permsRequestCode, String[] permissions,
                                           int[] grantResults) {
        switch (permsRequestCode) {
            case PERMISSION_REQ_CODE:
                // example how to get result of permissions requests (there can be more then one permission dialog)
                // boolean readAccepted = grantResults[0]==PackageManager.PERMISSION_GRANTED;
                // boolean writeAccepted = grantResults[1]==PackageManager.PERMISSION_GRANTED;
                // checking permissions to prevent situation when user denied some permission
                checkPerms();
                break;
        }
    }
}
