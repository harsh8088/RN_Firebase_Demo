package com.demoapp.model;

/**
 * Created by hrawat on 8/4/2017.
 */
public class Book {
    private String bookName;
    private String imgUrl;
    private String bookAuthorName;
    private String bookPrice;
    private String bookPublishYear;

    public Book(String bookName, String imgUrl, String bookAuthorName, String bookPrice, String bookPublishYear) {
        this.bookName = bookName;
        this.imgUrl = imgUrl;
        this.bookAuthorName = bookAuthorName;
        this.bookPrice = bookPrice;
        this.bookPublishYear = bookPublishYear;
    }

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getBookAuthorName() {
        return bookAuthorName;
    }

    public void setBookAuthorName(String bookAuthorName) {
        this.bookAuthorName = bookAuthorName;
    }

    public String getBookPrice() {
        return bookPrice;
    }

    public void setBookPrice(String bookPrice) {
        this.bookPrice = bookPrice;
    }

    public String getBookPublishYear() {
        return bookPublishYear;
    }

    public void setBookPublishYear(String bookPublishYear) {
        this.bookPublishYear = bookPublishYear;
    }
}
