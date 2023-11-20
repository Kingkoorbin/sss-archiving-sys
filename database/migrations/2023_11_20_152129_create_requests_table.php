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
        Schema::create('contribution_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('editor')->nullable();

            $table->string('sss_no');
            $table->string('name');
            $table->date('date_of_employment');
            $table->date('date_of_resignation');
            $table->string('requester');
            $table->string('email');
            $table->string('phone_number');
            $table->date('date_needed');
            $table->string('status');
            $table->timestamps();

            $table->foreign('editor')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contribution_requests');
    }
};
