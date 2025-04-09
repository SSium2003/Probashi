<?php

namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Models\JobPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobPostingController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'job_id' => 'required|int',
            'job_requirment' => 'required|string',
            'employment_type' => 'required|string|max:100',
            'designation' => 'required|string|max:100',
            'department' => 'required|string|max:100',
            'agency_id' => 'required|integer',
            'country' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'time_slot' => 'nullable|string|max:100',
            'salary_range' => 'required|string|max:100',
            'salary_currency' => 'required|string|max:10',
            'contact_email' => 'required|email|max:255',
            
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        

        try {
            $jobPosting = JobPost::create($request->all());

            // $jobPosting = JobPosting::create([
            //     'job_title' =>  $request->job_title,
            //     'job_title' =>  $request->job_title,
            //     'job_title' =>  $request->job_title,
            //     'job_title' =>  $request->job_title,
            //     'job_title' =>  $request->job_title,
            //     'job_title' =>  $request->job_title,
            //     'job_title' =>  $request->job_title,
            //     'job_title' =>  $request->job_title,
            //     'job_title' =>  $request->job_title,

            // ]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Job posting created successfully',
                'data' => $jobPosting
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create job posting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // get job post method

    public function index(Request $request)
    {
        // Start with all job postings
        $query = JobPost::query();
        
        // Apply search filters if provided
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%");
            });
        }
        
        // Filter by country
        if ($request->has('country')) {
            $query->where('country', $request->input('country'));
        }
        
        // Filter by city
        if ($request->has('city')) {
            $query->where('city', $request->input('city'));
        }
        
        // Filter by employment type
        if ($request->has('employment_type')) {
            $query->where('employment_type', $request->input('employment_type'));
        }
        
        // Filter by department
        if ($request->has('department')) {
            $query->where('department', $request->input('department'));
        }
        
        // Filter by experience level
        if ($request->has('experience_level')) {
            $query->where('experience_level', $request->input('experience_level'));
        }
        
        // Filter by salary range (example: ?min_salary=50000)
        if ($request->has('min_salary')) {
            $query->whereRaw("CAST(SUBSTRING_INDEX(salary_range, ' - ', 1) AS UNSIGNED) >= ?", 
                           [$request->input('min_salary')]);
        }
        
        if ($request->has('max_salary')) {
            $query->whereRaw("CAST(SUBSTRING_INDEX(salary_range, ' - ', -1) AS UNSIGNED) <= ?", 
                           [$request->input('max_salary')]);
        }
        
        // Pagination (default 10 items per page)
        //$perPage = $request->input('per_page', 10);
        //$jobPostings = $query->paginate($perPage);
        
        $jobPostings = $query->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $jobPostings
        ]);
    }
}
