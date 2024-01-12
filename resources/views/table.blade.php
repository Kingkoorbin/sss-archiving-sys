<table class="{{ !$loop->last ? 'page-break' : ''}}">
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
        </tr>
    </thead>
    <tbody>
    @if(isset($contribution['contributions']) && count($contribution['contributions']) > 0)
        @foreach($contribution['contributions'] as $item)
            <tr>
                <td>{{ $item->id ?? '' }}</td>
                <td>{{ $item->name ?? '' }}</td>
            </tr>
        @endforeach
    @else
        <tr>
            <td colspan="2">No contributions available</td>
        </tr>
    @endif
    </tbody>
</table>
