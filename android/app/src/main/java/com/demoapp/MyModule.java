package com.demoapp;

import android.app.Dialog;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.demoapp.model.Book;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by hrawat on 8/3/2017.
 */
public class MyModule extends ReactContextBaseJavaModule {

    private Book book;

    public MyModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    /**
     * The string returned by getName() has to be same as the class name.
     */
    @Override
    public String getName() {
        return "MyModule";
    }

    @ReactMethod
    public void alert(String message) {
        Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_SHORT).show();
    }

    @ReactMethod
    public void dialog(String url, final Callback callback) {
        // custom dialog
        final Dialog dialog = new Dialog(getCurrentActivity());
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setCancelable(false);
        dialog.setContentView(R.layout.custom_dialog);
        final TextView textViewUrl = (TextView) dialog.findViewById(R.id.img_url);
        final EditText inputBookName = (EditText) dialog.findViewById(R.id.input_book_name);
        final EditText inputAuthor = (EditText) dialog.findViewById(R.id.input_author);
        final EditText inputPrice = (EditText) dialog.findViewById(R.id.input_price);
        final EditText inputPublishYear = (EditText) dialog.findViewById(R.id.input_publish_year);
        if (url != null)
            textViewUrl.setText(url);

        Button btnCancel = (Button) dialog.findViewById(R.id.btn_cancel);
        Button btnSave = (Button) dialog.findViewById(R.id.btn_save);
        btnSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                book = new Book(inputBookName.getText().toString(),
                        textViewUrl.getText().toString(), inputAuthor.getText().toString(),
                        inputPrice.getText().toString(), inputPublishYear.getText().toString());
                callback.invoke(inputBookName.getText().toString(), textViewUrl.getText().toString(),
                        inputAuthor.getText().toString(), inputPrice.getText().toString(),
                        inputPublishYear.getText().toString());
                dialog.dismiss();
            }
        });
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });
        dialog.show();
    }

    @ReactMethod
    private void getBookDetails(Callback booleanCallback) {
        // return new Book("fds","www.nlksndcsn.sdc","bhaki","1354","2016");
        // booleanCallback.invoke(new Book("fds","www.nlksndcsn.sdc","bhaki","1354","2016"));
        booleanCallback.invoke("a", "b", "c");
    }

    @ReactMethod
    public void settingsDialog(final Callback callback) {
        // custom dialog
        final Dialog dialog = new Dialog(getCurrentActivity());
        dialog.setContentView(R.layout.setting_dialog);
        dialog.setTitle("Select Theme");
        final RadioGroup radioGroup = (RadioGroup) dialog.findViewById(R.id.rg_theme);

        Button btnDone = (Button) dialog.findViewById(R.id.btn_done);
        btnDone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String theme = "";
                switch (radioGroup.getCheckedRadioButtonId()) {
                    case R.id.rb_blue_grey:
                        theme = "blue_grey";
                        break;
                    case R.id.rb_deep_orange:
                        theme = "deep_orange";
                        break;
                    case R.id.rb_deep_purple:
                        theme = "deep_purple";
                        break;
                    case R.id.rb_green:
                        theme = "green";
                        break;
                    case R.id.rb_teal:
                        theme = "teal";
                        break;
                    case R.id.rb_default:
                        theme = "default";
                        break;
                }
                callback.invoke(theme);
                dialog.dismiss();
            }
        });
        dialog.show();
    }
}