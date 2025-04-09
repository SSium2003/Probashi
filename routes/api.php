<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\JobListController;
use App\Http\Controllers\Api\V1\JobPostingController;


Route::get('/user/list', function (Request $request) {
    return [
        'user' => "test"
    ];
});

Route::get('/job/list',[JobListController::class,'index']);
// routes/api.php

Route::post('/job-postings', [JobPostingController::class, 'store']);

Route::get('/job-postings', [JobPostingController::class, 'index']);
