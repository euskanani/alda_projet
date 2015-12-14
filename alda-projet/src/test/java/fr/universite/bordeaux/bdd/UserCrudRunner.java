package fr.universite.bordeaux.bdd;

import java.util.Arrays;
import java.util.List;
import java.util.Properties;

import org.jbehave.core.Embeddable;
import org.jbehave.core.configuration.Configuration;
import org.jbehave.core.configuration.MostUsefulConfiguration;
import org.jbehave.core.embedder.StoryControls;
import org.jbehave.core.i18n.LocalizedKeywords;
import org.jbehave.core.io.CodeLocations;
import org.jbehave.core.io.LoadFromClasspath;
import org.jbehave.core.io.UnderscoredCamelCaseResolver;
import org.jbehave.core.junit.JUnitStories;
import org.jbehave.core.model.ExamplesTableFactory;
import org.jbehave.core.parsers.RegexStoryParser;
import org.jbehave.core.reporters.Format;
import org.jbehave.core.reporters.FreemarkerViewGenerator;
import org.jbehave.core.reporters.PrintStreamStepdocReporter;
import org.jbehave.core.reporters.StoryReporterBuilder;
import org.jbehave.core.steps.InjectableStepsFactory;
import org.jbehave.core.steps.InstanceStepsFactory;
import org.jbehave.core.steps.ParameterConverters;
import org.junit.runner.RunWith;

import de.codecentric.jbehave.junit.monitoring.JUnitReportingRunner;

@RunWith(JUnitReportingRunner.class)
public class UserCrudRunner extends JUnitStories {
	
	public UserCrudRunner() {
		super();
	}
	
	@Override
	public Configuration configuration() {
		 Class<? extends Embeddable> embeddableClass = this.getClass();
	        Properties viewResources = new Properties();
	        viewResources.put("decorateNonHtml", "false");
	        // Start from default ParameterConverters instance
	        ParameterConverters parameterConverters = new ParameterConverters();
	        // factory to allow parameter conversion and loading from external
	        // resources (used by StoryParser too)
	        ExamplesTableFactory examplesTableFactory = new ExamplesTableFactory(new LocalizedKeywords(),
	                new LoadFromClasspath(embeddableClass), parameterConverters);
	        
	        return new MostUsefulConfiguration()
	        		.useStepdocReporter(new PrintStreamStepdocReporter())
	        		.useViewGenerator(new FreemarkerViewGenerator())
	                .useStoryControls(new StoryControls().doDryRun(false).doSkipScenariosAfterFailure(false))
	                .useStoryLoader(new LoadFromClasspath(embeddableClass))
	                .useStoryParser(new RegexStoryParser(examplesTableFactory))
	                .useStoryPathResolver(new UnderscoredCamelCaseResolver())
	                .useStoryReporterBuilder(
	                        new StoryReporterBuilder()
	                                .withCodeLocation(CodeLocations.codeLocationFromClass(embeddableClass))
	                                .withFormats(Format.STATS,Format.HTML)
	                                .withPathResolver(new org.jbehave.core.reporters.FilePrintStreamFactory.ResolveToPackagedName())
	                                .withViewResources(viewResources)
	                                .withFailureTrace(true)
	                                .withFailureTraceCompression(true));
	}
	
 
	@Override
	public InjectableStepsFactory stepsFactory() {
		return new InstanceStepsFactory(configuration(), new UserCRUDSteps());
	}
 
	@Override
	protected List<String> storyPaths() {
		return Arrays.asList("stories/UserCRUD.story");
	}
}
