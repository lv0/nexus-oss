package org.sonatype.scheduling;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;
import java.util.Iterator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A simple progress listener that logs messages into SLF4J API.
 * 
 * @author cstamas
 */
public class LoggingProgressListener
    implements ProgressListener
{
    private static final Workunit ROOT = new Workunit( "root", UNKNOWN );

    private final Logger logger;

    private final Deque<Workunit> workunits;

    private volatile boolean cancelled = false;

    public LoggingProgressListener( final String name )
    {
        this( LoggerFactory.getLogger( name ) );
    }

    public LoggingProgressListener( final Logger logger )
    {
        this.logger = logger;
        this.workunits = new ArrayDeque<Workunit>( Arrays.asList( ROOT ) );
        this.cancelled = false;
    }

    protected void log( final String message, Object... param )
    {
        if ( logger != null )
        {
            logger.info( message, param );
        }
    }

    public void beginTask( String name, int toDo )
    {
        workunits.push( new Workunit( name, toDo ) );

        if ( UNKNOWN != toDo )
        {
            log( "{}: started ({} steps).", getStackedWorkunitNames(), toDo );
        }
        else
        {
            log( "{}: started.", getStackedWorkunitNames() );
        }
    }

    public void working( int workDone )
    {
        workunits.peek().done( workDone );
    }

    public void working( String message, int workDone )
    {
        final Workunit wu = workunits.peek();

        wu.done( workDone );

        if ( UNKNOWN != wu.getToDo() )
        {
            log(
                "{}: {} ({}/{})",
                new Object[] { getStackedWorkunitNames(), nvl( message ), String.valueOf( wu.getDone() ),
                    String.valueOf( wu.getToDo() ) } );
        }
        else
        {
            log( "{}: {} ({})", new Object[] { getStackedWorkunitNames(), nvl( message ), wu.getDone() } );
        }
    }

    public void endTask( String message )
    {
        log( "{}: finished: {}", getStackedWorkunitNames(), nvl( message ) );

        if ( workunits.size() > 1 )
        {
            workunits.pop();
        }
    }

    public boolean isCancelled()
    {
        return cancelled;
    }

    public void cancel()
    {
        log( "{}: cancelled, bailing out (may take a while).", getStackedWorkunitNames() );

        this.cancelled = true;
    }

    // ==

    protected String nvl( final String str )
    {
        return String.valueOf( str );
    }

    protected String getStackedWorkunitNames()
    {
        Iterator<Workunit> wi = workunits.descendingIterator();
        
        // skip root
        wi.next();

        if ( wi.hasNext() )
        {
            final StringBuilder sb = new StringBuilder( wi.next().getName() );

            for ( ; wi.hasNext(); )
            {
                sb.append( " - " ).append( wi.next().getName() );
            }

            return sb.toString();
        }
        else
        {
            return "";
        }
    }

    // ==

    public static class Workunit
    {
        private final String name;

        private final int toDo;

        private int done;

        public Workunit( final String name, final int toDo )
        {
            this.name = name;
            this.toDo = toDo;
            this.done = 0;
        }

        public String getName()
        {
            return name;
        }

        public int getToDo()
        {
            return toDo;
        }

        public int getDone()
        {
            return done;
        }

        public void done( int done )
        {
            this.done += done;
        }
    }
}
