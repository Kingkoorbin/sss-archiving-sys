<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use PDF;
use App\Models\Contributions;
use Carbon\Carbon;
use App\Models\Client;

class GeneratePDFController extends Controller
{
    public function generatePDF(Request $request)
    {
        $displaySSSNo = $request->query('displaySSSNo');
        $displayName = $request->query('displayName');
        $displayCoverage = $request->query('displayCoverage');

        $name = $request->query('name');
        $sssNo = $request->query('sssNo');
        $from = $request->query('from');
        $to = $request->query('to');

        $query = Contributions::query();

        if($sssNo) {
            $client = Client::findBySSSNo($sssNo)->first();
            if($client) {
                $displayName = $client->full_name;
            }
        }
        
        if ($sssNo && !$from && !$to) {
            $query->where('sss_no', $sssNo);
        }
        
        if ($name) {
            $query->where('name', 'ILIKE', "%$name%");
        }
        
        if ($sssNo && $from && $to) {
            $query->where('sss_no', $sssNo);
            $query->whereBetween('batchDate', [$from, $to]);
        }
        
        $query->orderBy('updated_at', 'desc');

        $contributions = $query->get();

        $groupedContributions = $contributions->groupBy(function ($contribution) {
            return Carbon::parse($contribution->batchDate)->format('Y');
        });    
        
        $result = $groupedContributions->map(function ($contributions, $batchDate) {
            return [
                'batch' => $batchDate,
                'contributions' => $contributions->map(function ($contribution) {
                    $contribution->month = Carbon::parse($contribution->batchDate)->format('F');
                    return $contribution;
                }),            
            ];
        })->values()->toArray();
        
        $pdf = PDF::loadView('contributions', [
            'contributions' => $result,
            'displaySSSNo' => $displaySSSNo,
            'displayName' => $displayName,
            'displayCoverage' => $displayCoverage,
        ]);     
        $filename = now()->format('Y-m-d') . '_contribution';

        return $pdf->download("$filename.pdf");
    }
}
