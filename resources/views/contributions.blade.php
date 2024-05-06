<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            line-height: 1.25;
        }

        body {
            font-family: 'Arial', sans-serif;
            background-image: url("{{ public_path('images/pdf_bg.jpg') }}");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;
            background-attachment: fixed;
        }

        .page-break {
            page-break-after: always;
        }

        .page-space {
            margin-top: 350px;
        }

        table {
            margin-left: 170px;
            border-collapse: collapse;
            width: 80%; /* Adjusted table width */
        }

        thead {
            display: table-header-group;
        }

        th {
            background-color: #f2f2f2;
            position: sticky;
            top: 0;
            padding: 10px;
            font-size: 30px; /* Adjusted font size */
        }

        th, td {
            text-align: left;
            font-size: 25px;
            padding: 10px;
        }

        .hidden {
            opacity: 0;
            visibility: 0;
        }

        th.sbr-date {
            width: 100px;
        }

        th.sbr-no {
            width: 120px;
        }

        th.year {
            width: 70px;
        }

        th.month {
            width: 100px;
        }

        th.ec {
            width: 100px;
        }

        th.total {
            width: 100px;
        }

        th.ss {
            width: 100px;
        }

        .info {
            margin-top: 50px;
            margin-left: 200px;
            margin-bottom: 20px;
        }

        .title {
            margin-top: 250px;
            margin-left: 100px;
            margin-bottom: 20px;
        }

        .page-number {
            text-align: center;
            margin-top: 20px;
        }

        .next-page {
            text-align: center;
            margin-top: 20px;
            margin-bottom: 20px;
        }
    </style>
</head>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<body>
    <div class="title">
        <center>
            <h4 style='padding: 0px; margin: 0px'>CERTIFICATE OF SSS PREMIUM PAYMENTS</h4>
        </center>
    </div>
    <div class="info">
        @if ($displayName)
            <h5 style="padding: 0px; margin: 0px;">Name : {{ $displayName }}</h5>
        @endif

        @if ($displaySSSNo)
            <h5 style="padding: 0px; margin: 0px;">SSS No : {{ $displaySSSNo }}</h5>
        @endif

        @if ($contributions->count() > 0)
            @php
                $minDate = Carbon\Carbon::parse($contributions->min('batchDate'));
                $maxDate = Carbon\Carbon::parse($contributions->max('batchDate'));
                $minYear = $minDate->format('Y');
                $maxYear = $maxDate->format('Y');
                $minMonth = $minDate->format('F');
                $maxMonth = $maxDate->format('F');
            @endphp
            <h5 style="padding: 0px; margin: 0px;">Coverage: {{ $minMonth . ' ' . $minYear }} to {{ $maxMonth . ' ' . $maxYear }}</h5>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th style="text-align: center;" class="year">Year</th>
                <th style="text-align: center;" class="month">Month</th>
                <th style="text-align: center;" class="ss">SS</th>
                <th style="text-align: center;" class="ec">EC</th>
                <th style="text-align: center;" class="sbr-no">SBR No</th>
                <th style="text-align: center;" class="sbr-date">SBR Date</th>
            </tr>
        </thead>
        <tbody>
            @php
                $currentYear = null;
                $totalss = 0;
                $totalec = 0;
                $overall = 0;
           @endphp
            @foreach($contributions as $index => $contribution)
            @endphp
                @if($index > 0 && $index % 24 === 0)
            </tbody>
                </table>
                <div class="page-break"></div>
                <div class="page-space"></div>
                <table>
                    <thead>
                        <tr>
                            <th style="text-align: center;" class="year">Year</th>
                            <th style="text-align: center;" class="month">Month</th>
                            <th style="text-align: center;" class="ss">SS</th>
                            <th style="text-align: center;" class="ec">EC</th>
                            <th style="text-align: center;" class="sbr-no">SBR No</th>
                            <th style="text-align: center;" class="sbr-date">SBR Date</th>
                        </tr>
                    </thead>
                    <tbody>
                @endif
                <tr style="margin-bottom: 10px;">
                    <td style="text-align: center;" class="{{ $currentYear === substr($contribution['batchDate'], 0, 4) ? 'hidden' : '' }}">{{ substr($contribution['batchDate'], 0, 4) }}</td>
                    <td style="text-align: center;"> {{ Carbon\Carbon::parse($contribution['batchDate'])->format('F') }} </td>
                    <td style="text-align: right;">@if($index % 24 === 0) Php @endif{{ $contribution['ss'] }}</td>    
                    <td style="text-align: right;">@if($index % 24 === 0) Php @endif{{ $contribution['ec'] }}</td>
                    <td style="text-align: center;">{{ $contribution['sbr_no'] }}</td>
                    <td style="text-align: center;">{{ Carbon\Carbon::parse($contribution['sbr_date'])->format('m-d-Y') }}</td>
                    @php
                    // Remove non-numeric characters from $contribution['ss'] before converting to integer
                    $ss_numeric = preg_replace('/[^0-9.]/', '', $contribution['ss']);
                    $totalss += intval($ss_numeric); // Accumulate total SS contributions

                    // Remove non-numeric characters from $contribution['ss'] before converting to integer
                    $ss_numeric2 = preg_replace('/[^0-9.]/', '', $contribution['ec']);
                    $totalec += intval($ss_numeric2); // Accumulate total SS contributions

                    $overall = $totalss + $totalec;
                @endphp

                </tr>
                @php
                    $currentYear = substr($contribution['batchDate'], 0, 4);
                @endphp
            @endforeach
        </tbody>
    </table>
    <!-- <p>TOTAL SS: {{ $totalss }}</p>
    <p>TOTAL ec: {{ $totalec }}</p>
    <p>TOTAL ec: {{ $overall }}</p> -->
   
    <p style='font-size: 30px; font-weight: bolder; text-align: right; margin-right: 180px;'>Total Amount: Php {{ number_format($overall ?? 0, 2) }}</p>

    @if( $index > 0 && $index % 24 === 0)
    <center><div><h6 style='padding: 0px; margin-bottom: 50px;'></h6></div></center>
    @endif
    <center>=== Nothing Follows ===</center>
    <br><br>
    @if($index > 22)
    <div class="page-break"></div>
    <br><br><br><br><br><br><br><br>

        <table>
            <thead>
            <tr>
            <td colspan="2" style="background-color: none; text-align: center;">
        <h5 style='padding: 0px; margin: 0px; font-size: 30px'>Employer Name : LOURDESS COLLEGE</h5>
        <h5 style='padding: 0px; margin: 0px; font-size: 30px'>Employer Number : 08-0027000-1</h5>
            </td>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td style="text-align: center;" >        <div style=' margin-top: 30px; '>
            <h6 style='padding: 0px; margin-bottom: 50px; font-size: 30px;'>Prepared By</h6><br><br>
            <p style='padding: 0px; margin: 0px'>MS. CRISTIE LYN. ABAMONGA</p>
            <p style='padding: 0px; margin: 0px; font-size: 30px;'>Payroll Incharge</p>
        </div></td>
                <td style="text-align: center;" >        <div style=' margin-top: 30px; '>
            <h6 style='padding: 0px; margin-bottom: 50px; font-size: 30px;'>Noted By</h6><br><br>
            <p style='padding: 0px; margin: 0px'>S. MARIA MAE M. ANACAYA, RVM</p>
            <p style='padding: 0px; margin: 0px; font-size: 30px;'>Vice President for Finance</p>
        </div></td>
            </tr>
            </tbody>
            </table>
    @elseif($index < 22)
    <table>
            <thead>
            <tr>
            <td colspan="2" style="background-color: white; text-align: center;">
        <h5 style='padding: 0px; margin: 0px; font-size: 30px'>Employer Name : LOURDESS COLLEGE</h5>
        <h5 style='padding: 0px; margin: 0px; font-size: 30px'>Employer Number : 08-0027000-1</h5>
            </td>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td style="text-align: center;" >        <div style=' margin-top: 30px; '>
            <h6 style='padding: 0px; margin-bottom: 50px; font-size: 30px;'>Prepared By</h6><br><br>
            <p style='padding: 0px; margin: 0px'>MS. CRISTIE LYN. ABAMONGA</p>
            <p style='padding: 0px; margin: 0px; font-size: 30px;'>Payroll Incharge</p>
        </div></td>
                <td style="text-align: center;" >        <div style=' margin-top: 30px; '>
            <h6 style='padding: 0px; margin-bottom: 50px; font-size: 30px;'>Noted By</h6><br><br>
            <p style='padding: 0px; margin: 0px'>S. MARIA MAE M. ANACAYA, RVM</p>
            <p style='padding: 0px; margin: 0px; font-size: 30px;'>Vice President for Finance</p>
        </div></td>
            </tr>
            </tbody>
            </table>
    @endif
    <!-- <center>
        <h5 style='padding: 0px; margin: 0px'>Employer Name : LOURDESS COLLEGE</h5>
        <h5 style='padding: 0px; margin: 0px'>Employer Number : 08-0027000-1</h5>
    </center>
    <center>
        <div style=' margin-top: 30px; '>
            <h6 style='padding: 0px; margin-bottom: 50px;'>Prepared By</h6>
            <p style='padding: 0px; margin: 0px'>MS. CRISTIE LYN. ABAMONGA</p>
            <p style='padding: 0px; margin: 0px; font-size: 30px;'>Payroll Incharge</p>
        </div>
        <div style=' margin-top: 30px; '>
            <h6 style='padding: 0px; margin-bottom: 50px;'>Noted By</h6>
            <p style='padding: 0px; margin: 0px'>S. MARIA MAE M. ANACAYA, RVM</p>
            <p style='padding: 0px; margin: 0px; font-size: 30px;'>Vice President for Finance</p>
        </div>
    </center> -->

</body>
</html>
