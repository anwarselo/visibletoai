# Local Testing Plan - Pre-Deployment Checklist

## Overview
This document outlines comprehensive local testing to ensure everything works before deploying to Vercel.

---

## Test Suite

### ✅ Test 1: Server & Basic Routes
- [ ] Server starts without errors
- [ ] Homepage loads (`/`)
- [ ] robots.txt loads (`/robots.txt`)
- [ ] sitemap.xml loads (`/sitemap.xml`)
- [ ] indexnow-key.txt loads (`/indexnow-key.txt`)

### ✅ Test 2: File Upload - Text File
- [ ] Upload text file succeeds
- [ ] Redirects to microsite
- [ ] Microsite displays content
- [ ] LLM summarization applied
- [ ] Source link works

### ✅ Test 3: File Upload - PDF
- [ ] Upload PDF succeeds
- [ ] PDF text extraction works
- [ ] Content displayed correctly
- [ ] LLM summarization applied

### ✅ Test 4: File Upload - Image (OCR)
- [ ] Upload image succeeds
- [ ] OCR extraction works (DeepSeek or Tesseract)
- [ ] Content displayed correctly
- [ ] LLM summarization applied

### ✅ Test 5: Database Verification
- [ ] Business record created
- [ ] Asset record created
- [ ] Public page record created
- [ ] Index event record created

### ✅ Test 6: SEO & Metadata
- [ ] Meta tags present (title, description)
- [ ] Open Graph tags present
- [ ] Twitter card tags present
- [ ] Canonical URL correct
- [ ] JSON-LD structured data present

### ✅ Test 7: Sitemap Generation
- [ ] Sitemap includes all uploaded microsites
- [ ] URLs are correctly formatted
- [ ] lastmod timestamps present
- [ ] changefreq and priority set

### ✅ Test 8: IndexNow Integration
- [ ] Ping sent to Bing
- [ ] Status logged (422 expected for localhost)
- [ ] Status displayed in footer
- [ ] Response body logged

### ✅ Test 9: Multiple Uploads
- [ ] Upload 3+ different businesses
- [ ] Each gets unique slug
- [ ] Each appears in sitemap
- [ ] All microsites accessible

### ✅ Test 10: Edge Cases
- [ ] Upload same business name twice (different slugs?)
- [ ] Upload file with special characters in name
- [ ] Upload very large file (within limits)
- [ ] Upload file with no extractable text

---

## Test Execution Log

Date: November 18, 2025
Tester: AI Agent
Environment: localhost:3000

---

## Results Summary

**Total Tests:** 10 categories  
**Tests Passed:** TBD  
**Tests Failed:** TBD  
**Critical Issues:** TBD  
**Ready for Production:** TBD

