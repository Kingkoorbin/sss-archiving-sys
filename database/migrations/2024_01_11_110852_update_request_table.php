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
        Schema::table('contribution_requests', function (Blueprint $table) {
            $table->string('relationship')->nullable()->default('');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contribution_requests', function (Blueprint $table) {
            // Reverse the changes made in the up() method
            $table->dropColumn([
                'relationship',
            ]);
        });
    }
};