<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            //
            $table->unsignedBigInteger('job_id');
            $table->longText('job_requirment');
            $table->string('employment_type');
            $table->string('designation');
            $table->string('department')->nullable();
            $table->unsignedBigInteger('agency_id');
            $table->string('country');
            $table->string('city');
            $table->string('time_slot')->nullable();
            $table->string('salary_range')->default('Negotiable');
            $table->string('salary_currency')->default('USD');
            $table->text('contact_email')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            //
        });
    }
};
