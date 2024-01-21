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
            width: 50px;
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
            @endphp
            @foreach($contributions as $index => $contribution)
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
                    <td>{{ Carbon\Carbon::parse($contribution['batchDate'])->format('F') }}</td>
                    <td style="text-align: right;">@if($index % 24 === 0) Php @endif{{ $contribution['ss'] }}</td>
                    <td style="text-align: right;">@if($index % 24 === 0) Php @endif{{ $contribution['ec'] }}</td>
                    <td style="text-align: center;">{{ $contribution['sbr_no'] }}</td>
                    <td style="text-align: center;">{{ Carbon\Carbon::parse($contribution['sbr_date'])->format('m-d-Y') }}</td>
                </tr>
                @php
                    $currentYear = substr($contribution['batchDate'], 0, 4);
                @endphp
            @endforeach
        </tbody>
    </table>
    <center>=== Nothing Follows === </center>
    <br><br>
    @if($index % 13)
    <div class="page-break"></div>
    </div>
        @if($index % 13)
        <br><br><br><br><br><br><br><br>
        @endif
    @endif
    <center>
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
    </center>

</body>
</html>
